import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  UserEntity,
  UserOtpRepository,
  UserRepository,
  UserSocialRepository,
} from '@/modules/database';
import { UserDto, ProfileRankingResponseDto } from '@/common/dto/user.dto';
import { ContextProvider } from '@/providers';
import { ApproveProfileViewerRequestDto, UpdateUserRequestDto } from '../dto/update-user.dto';
import { ChangePasswordRequestDto } from '../dto/change-password';
import { checkHashPassword, generateHashPassword } from '../../../utils/passwd';
import { AccountTypeEnum, NotificationTypeEnum, OTPSenderTypeEnum, OTPTypeEnum, RoleTypeEnum } from '../../../common/enums';
import { UserNotFoundException } from '../../../exceptions';
import { generateOTPCode, generateOTPToken } from '../../../utils/random';
import { ISendMail } from '../../core/interfaces';
import {
  appConfig,
  mailTemplatePathConfig,
  sendMailQueueConfig,
} from '../../../config';
import { KafkaClientService } from '../../core/services/kafka-client.service';
import { Transactional } from 'typeorm-transactional';
import {
  SendOtpToEmailRequestDto,
  SendOtpToEmailResponseDto,
  VerifyEmailRequestDto,
} from '../dto/verify-personal-info.dto';
import {
  EMAIL_VERIFICATION_EXPIRATION,
  MAX_FAILED_VERIFY_ATTEMPTS,
} from '../../../common/constants';
import { CustomError, ErrorCodes } from '../../../common/errors';
import { AuthService } from '../../auth/services/auth.service';
import { isBannedUsername } from '../../../utils/username';
import { getRankByNetWorth, isHigherRank } from '@/utils/net-worth-ranks';
import { ShareProfileRepository } from '@/modules/database/typeorm/repositories/user/share-profile.repository';
import { ShareMailReponseDto, ShareProfileRequestDto } from '../dto/share-profile.dto';
import { ShareProfileStatus } from '@/common/enums/share-profile-status.enum';
import { Brackets, In } from 'typeorm';
import { UserMinifyDto } from '../dto/query-user.dto';
import { PageUserDto, SearchUsersDto } from '../dto/search-user.dto';


@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepo: UserRepository,
    private readonly userSocialRepo: UserSocialRepository,
    private readonly userOtpRepo: UserOtpRepository,
    private readonly kafkaClientService: KafkaClientService,
    private readonly authService: AuthService,
  ) { }

  async getProfile(userId: string): Promise<UserDto> {
    const user = await this.userRepo.findOne({
      where: {
        id: userId,
        deletedAt: null,
      },
      relations: {
        socials: true,
      }
    });
    return new UserDto(user);
  }

  @Transactional()
  async updateProfile(data: UpdateUserRequestDto): Promise<UserDto> {
    const user = await ContextProvider.getAuthUser();

    if (data.avatar) {
      await this.updateAvatar(user, data.avatar);
    }
    const updateData: Partial<UserEntity> = { ...data };

    if (data.username) {
      if (isBannedUsername(data.username)) {
        throw new BadRequestException('Username not allowed.');
      }
      if (data.username !== user.getUsername()) {
        const existingUser = await this.userRepo.findOneByUsername(data.username);
        if (existingUser) {
          throw new BadRequestException(
            'The username is already in use by another account.',
          );
        }
      }
    }

    const result = await this.userRepo.update(user.id, updateData);
    if (result.affected === 0) {
      throw new Error('User update failed or user not found');
    }
    const updatedUser = await this.userRepo.findById(user.id);
    return new UserDto(updatedUser);
  }

  async updateAvatar(user: UserEntity, avatar: string): Promise<UserDto> {
    user.avatar = avatar;
    await this.userRepo.save(user);
    return new UserDto(user);
  }

  @Transactional()
  async updateEmail(
    data: SendOtpToEmailRequestDto,
  ): Promise<SendOtpToEmailResponseDto> {
    const user = await ContextProvider.getAuthUser();
    const { email: currentEmail } = user;
    const newEmail = data.email;
    if (currentEmail != newEmail) {
      const existedEmail = await this.userRepo.findOneBy({
        email: newEmail,
      });
      if (existedEmail)
        throw new ConflictException(
          'The email is already in use by another account.',
        );
      await this.sendVerificationEmail(user, newEmail);
      return {
        success: true,
        message: 'Verification email sent successfully.',
      };
    }
    if (currentEmail == newEmail && !user.emailVerified) {
      await this.sendVerificationEmail(user);
      return {
        success: true,
        message: 'Verification email sent successfully.',
      };
    }

    return {
      success: true,
      message: 'No changes made.',
    };
  }

  async sendVerificationEmail(user: UserEntity, newEmail?: string) {
    await this.authService.canSendVerificationEmail(
      user,
      OTPTypeEnum.EmailVerification,
    );

    await this.userOtpRepo.update(
      {
        userId: user.id,
        isVerified: false,
        type: OTPTypeEnum.EmailVerification,
      },
      { expiredAt: new Date() },
    ); // Mark old otp as expired
    const otp = await this.userOtpRepo.store({
      userId: user.id,
      type: OTPTypeEnum.EmailVerification,
      senderType: OTPSenderTypeEnum.Email,
      code: generateOTPCode(),
      token: generateOTPToken(),
      expiredAt: new Date(
        Date.now() + EMAIL_VERIFICATION_EXPIRATION * 3600 * 1000,
      ),
      receiver: newEmail || user.email,
    });
    const emailData: ISendMail = {
      to: newEmail || user.email,
      subject: 'Email Verification',
      template: mailTemplatePathConfig.emailVerificationPath,
      context: {
        fullName: user.name || user.username || user.email,
        activationCode: otp.code,
        activationLink: `${appConfig.url}/api/auth/verify-account?userId=${user.id}&token=${otp.token}&code=${otp.code}`,
        oldEmail: user.email,
        newEmail: newEmail || null,
      },
    };

    this.kafkaClientService.emit(sendMailQueueConfig.topic, emailData);
  }

  @Transactional()
  async verifyEmail(data: VerifyEmailRequestDto) {
    const user = await ContextProvider.getAuthUser();
    if (!user) throw new UserNotFoundException();

    const userId = user.id;
    const code = data.code;
    const otp = await this.userOtpRepo.findOne({
      where: {
        userId,
        senderType: OTPSenderTypeEnum.Email,
        type: OTPTypeEnum.EmailVerification,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    if (user.emailVerified && otp.receiver === user.email) {
      throw new CustomError(
        ErrorCodes.EmailAlreadyVerified,
        'Email already verified',
      );
    }

    if (!otp) {
      throw new CustomError(
        ErrorCodes.UserOtpNotfound,
        'Oops, wrong verification code. Try again',
      );
    }
    if (otp.isVerified || otp.isExpired()) {
      throw new CustomError(
        ErrorCodes.UserOtpInvalid,
        'Oops, this verification code is no longer valid. Please request a new one.',
      );
    }
    if (otp.failedVerifyAttempts >= MAX_FAILED_VERIFY_ATTEMPTS) {
      otp.expiredAt = new Date();
      otp.save();
      throw new CustomError(
        ErrorCodes.UserOtpInvalid,
        'You have entered the wrong OTP too many times. Please request a new one.',
      );
    }
    if (otp.code !== code) {
      otp.failedVerifyAttempts += 1;
      otp.save();
      throw new CustomError(
        ErrorCodes.UserOtpInvalid,
        'Oops, wrong verification code. Try again',
      );
    }

    if (user.email !== otp.receiver) {
      user.email = otp.receiver;
    }
    user.emailVerified = true;
    otp.isVerified = true;
    otp.expiredAt = new Date();

    await Promise.all([user.save(), otp.save()]);

    return true;
  }

  async changePassword(data: ChangePasswordRequestDto): Promise<UserDto> {
    const user = await ContextProvider.getAuthUser();
    if (user.password) {
      const isPasswordValid = checkHashPassword(data.oldPassword, user.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Old password is incorrect');
      }
    }
    user.password = data.newPassword;
    await user.save();
    return new UserDto(user);
  }

  @Transactional()
  async removeUser(): Promise<boolean> {
    const user = await ContextProvider.getAuthUser();
    user.activated = false;
    user.email = null;
    user.username = null;
    await user.softRemove();
    await this.userRepo.save(user);

    // Delete user social and crypto wallet
    await this.userSocialRepo.delete({ userId: user.id });
    return true;
  }

  async search(input: SearchUsersDto): Promise<PageUserDto> {
    try {
      const { q, limit, offset, rank } = input;
      const queryBuilder = this.userRepo.createQueryBuilder('user');
  
      if (q) {
        queryBuilder.where(
          new Brackets((qb) => {
            qb.where('LOWER(user.email) LIKE LOWER(:likeQuery)', { likeQuery: `%${q}%` })
              .orWhere('LOWER(user.username) LIKE LOWER(:likeQuery)', { likeQuery: `%${q}%` })
              .orWhere('LOWER(user.name) LIKE LOWER(:likeQuery)', { likeQuery: `%${q}%` });
          }),
        );
      }
  
      if (rank) {
        if (q) {
          queryBuilder.andWhere('user.rank = :rank', { rank });
        } else {
          queryBuilder.where('user.rank = :rank', { rank });
        }
      }
  
      const total = await queryBuilder.getCount();
      const users = await queryBuilder
        .take(limit)
        .skip(offset)
        .getMany();
  
      const userMinify = users.map(user => new UserMinifyDto(user));
      return new PageUserDto(userMinify, total);
    } catch (error) {
      this.logger.error(`Failed to search users: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to search users');
    }
  }

  async getUserByCode(code: string): Promise<UserEntity> {
    const user = await this.userRepo.findOne({
      where: { code},
      relations: {
        socials: true,
      }
    });
    return user;
  }

}
