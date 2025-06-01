/*
https://docs.nestjs.com/providers#services
*/

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  UserEntity,
  UserOtpRepository,
  UserRepository,
  UserSocialEntity,
  UserSocialRepository,
} from '@/modules/database';
import {
  CreateLoginSocialUrlRequestDto,
  LoginRequestDto,
  LoginResponseDto,
  LoginSocialRequestDto,
} from '../dto/login.dto';
import { TokenInvalidException, UserNotFoundException } from '@/exceptions';
import { JwtService } from '@nestjs/jwt';
import { AuthFactory } from '../factories/auth.factory';
import { JwtPayloadType } from '../types';
import { RegisterRequestDto } from '../dto/register.dto';
import { Transactional } from 'typeorm-transactional';
import { generateOTPCode, generateOTPToken } from '../../../utils/random';
import {
  OTPSenderTypeEnum,
  OTPTypeEnum,
  RoleTypeEnum,
  SocialTypeEnum,
} from '../../../common/enums';
import {
  appConfig,
  mailTemplatePathConfig,
  sendMailQueueConfig,
} from '../../../config';
import { CustomError, ErrorCodes } from '../../../common/errors';
import { ContextProvider } from '../../../providers';
import {
  SendVerificationEmailRequestDto,
  VerifyAccountRequestDto,
} from '../dto/verify-account.dto';
import { UserDto, UserSocialDto } from '../../../common/dto';
import {
  ForgotPasswordRequestDto,
  ResetPasswordRequestDto,
  VerifyOtpRequestDto,
} from '../dto/forgot-password.dto';
import { jwtConfig } from '../../../config';
import { ISendMail } from '../../core/interfaces';
import { KafkaClientService } from '../../core/services/kafka-client.service';
import {
  EMAIL_VERIFICATION_EXPIRATION,
  FORGOT_PASSWORD_EXPIRATION,
  LOCK_TIME_AFTER_FAILED_ATTEMPTS,
  MAX_FAILED_LOGIN_ATTEMPTS,
  MAX_FAILED_VERIFY_ATTEMPTS,
  RESEND_VERIFICATION_CODE_DELAY_MINUTES,
} from '../../../common/constants';
import dayjs from 'dayjs';
import { MoreThan } from 'typeorm';
import { IUser } from '../interfaces';
import { plainToInstance } from 'class-transformer';
import { LinkSocialRequestDto } from '../dto/link-social.dto';
import { UnlinkSocialRequestDto } from '../dto/unlink-social.dto';
import { token } from 'morgan';

@Injectable()
export class 
AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly messages = new Map<string, string>();

  constructor(
    private readonly userRepo: UserRepository,
    private readonly userSocialRepo: UserSocialRepository,
    private readonly jwtService: JwtService,
    private readonly userOtpRepo: UserOtpRepository,
    private readonly kafkaClientService: KafkaClientService,
  ) {}

  async me(userId: string): Promise<UserDto> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: {
        socials: true,
      },
    });
    return new UserDto(user);
  }

  async login(creds: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.userRepo.findOneBy({
      email: creds.email,
      ...(creds?.requiredAdmin && { role: RoleTypeEnum.Admin }),
    });
    if (!user || (user.emailVerified && !user.activated))
      throw new UserNotFoundException();

    const minutesAfterFailed =
      user.lastFailedAttempt &&
      dayjs().diff(dayjs(user.lastFailedAttempt), 'minute');

    // Check if user is locked
    if (
      user.failedLoginAttempts >= MAX_FAILED_LOGIN_ATTEMPTS &&
      minutesAfterFailed < LOCK_TIME_AFTER_FAILED_ATTEMPTS
    ) {
      const remainingLockTime =
        LOCK_TIME_AFTER_FAILED_ATTEMPTS - minutesAfterFailed;
      throw new BadRequestException(
        `Your account is locked due to too many failed login attempts. Please try again after ${remainingLockTime} minutes.`,
      );
    }

    if (
      !user.password ||
      (user.password && !user.checkPassword(creds.password))
    ) {
      if (
        minutesAfterFailed &&
        minutesAfterFailed >= LOCK_TIME_AFTER_FAILED_ATTEMPTS
      ) {
        user.failedLoginAttempts = 0;
      }
      user.failedLoginAttempts += 1;
      user.lastFailedAttempt = dayjs().toDate();
      await this.userRepo.save(user);
      throw new BadRequestException(
        `Your authentication information is incorrect. Please try again.`,
      );
    }

    user.failedLoginAttempts = 0;
    user.lastFailedAttempt = null;
    await this.userRepo.save(user);

    if (!user.emailVerified) {
      await this.sendVerificationEmail(user);
      return {
        message:
          'Your account is not verified. Please check your email and enter the verification code.',
        ...(await this.authenticate(user)),
      };
    }

    return this.authenticate(user);
  }

  @Transactional()
  async loginSocial(creds: LoginSocialRequestDto): Promise<any> {
    const { ref } = creds;
    this.logger.log('loginSocial creds = ' + JSON.stringify(creds));
    const authFactory = AuthFactory.create(creds.socialType);

    const authInfo: IUser = await authFactory.getUserInfo(creds.accessToken);

    let userSocial = await this.userSocialRepo.findOne({
      where: {
        socialType: creds.socialType,
        socialId: authInfo.id,
      },
    });
    let user: UserEntity = null;
    let isCreateUser = false;
    const referral = await this.userRepo.findOne({ where: { code: ref } });
    if (!userSocial) {
      const userBody = {
        email: authInfo.email,
        emailVerified: Boolean(authInfo.email),
        name: authInfo.name,
        username: authInfo.username,
        activated: true,
        role: RoleTypeEnum.User,
        avatar: authInfo.avatar,
        referredBy: referral ? referral.id : null,
      };

      const existingUsername = await this.userRepo.findOneBy({
        username: authInfo.username,
      });
      if (existingUsername) {
        userBody.username = authInfo.username
          ? `${authInfo.username}_${Date.now()}`
          : `user_${Date.now()}`;
      }

      user = authInfo.email
        ? await this.userRepo.findOneBy({ email: authInfo.email })
        : null;

      if (!user) {
        isCreateUser = true;
        user = await this.userRepo.store({
          ...userBody,
        });
      }

      userSocial = await this.userSocialRepo.store({
        userId: user.id,
        socialType: creds.socialType,
        socialId: authInfo.id,
        accessToken: creds.accessToken,
        refreshToken: creds.refreshToken,
      });
    } else {
      const dataUpdate: Partial<UserSocialEntity> = {
        accessToken: creds.accessToken,
        expiredAt: new Date(Date.now() + 3600 * 1000),
      };
      if (creds.refreshToken) {
        dataUpdate.refreshToken = creds.refreshToken;
        dataUpdate.refreshTokenExpiredAt = new Date(
          Date.now() + 6 * 30 * 24 * 3600 * 1000,
        );
      }
      await this.userSocialRepo.update(userSocial.id, dataUpdate);
      user = await this.userRepo.findOne({ where: { id: userSocial.userId } });
    }

    if (!user) throw new UserNotFoundException();
    return this.authenticate(user);
  }

  @Transactional()
  async register(data: RegisterRequestDto) {
    const { email, guestId, password } = data;
    let user: UserEntity = null;
    user = await this.userRepo.findOneBy({ email });
    if (user) throw new BadRequestException('Email already exists');
    const referral = await this.userRepo.findOne({ where: { code: data.ref } });
    const registerBody = {
      ...data,
      role: RoleTypeEnum.User,
      referredBy: referral ? referral.id : null,
    };
    user = await this.userRepo.store(registerBody);
    await this.sendVerificationEmail(user);
    return this.authenticate(user);
  }

  async sendVerificationEmail(user: UserEntity) {
    await this.canSendVerificationEmail(user, OTPTypeEnum.AccountActivation);

    await this.userOtpRepo.update(
      {
        userId: user.id,
        isVerified: false,
        type: OTPTypeEnum.AccountActivation,
      },
      { expiredAt: new Date() },
    ); // Mark old otp as expired
    const otp = await this.userOtpRepo.store({
      userId: user.id,
      type: OTPTypeEnum.AccountActivation,
      senderType: OTPSenderTypeEnum.Email,
      code: generateOTPCode(),
      token: generateOTPToken(),
      expiredAt: new Date(
        Date.now() + EMAIL_VERIFICATION_EXPIRATION * 3600 * 1000,
      ),
      receiver: user.email,
    });
    const emailData: ISendMail = {
      to: user.email,
      subject: 'Account activation',
      template: mailTemplatePathConfig.accountActivationPath,
      context: {
        fullName: user.name ? user.name : user.email,
        activationCode: otp.code,
      },
    };
    await this.kafkaClientService.emit(sendMailQueueConfig.topic, emailData);
  }

  @Transactional()
  async resendVerificationEmail(data: SendVerificationEmailRequestDto) {
    const { email } = data;
    const user = await this.userRepo.findOneBy({ email });
    if (!user) throw new UserNotFoundException();
    if (user.emailVerified) {
      throw new CustomError(
        ErrorCodes.UserAlreadyVerified,
        'Account already verified',
      );
    }
    await this.sendVerificationEmail(user);
    return {
      message: 'Verification email has been resent successfully.',
      success: true,
    };
  }

  @Transactional()
  async verifyAccount(params: VerifyAccountRequestDto) {
    const user = await ContextProvider.getAuthUser();
    if (!user) throw new UserNotFoundException();
    if (user.emailVerified) {
      throw new CustomError(
        ErrorCodes.UserAlreadyVerified,
        'Account already verified',
      );
    }

    const userId = user.id;
    const code = params.code;
    const otp = await this.userOtpRepo.findOne({
      where: {
        userId,
        senderType: OTPSenderTypeEnum.Email,
        type: OTPTypeEnum.AccountActivation,
      },
      order: {
        createdAt: 'DESC',
      },
    });

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

    user.emailVerified = true;
    user.activated = true;
    otp.isVerified = true;
    otp.expiredAt = new Date();

    await Promise.all([user.save(), otp.save()]);

    return true;
  }

  async forgotPassword(data: ForgotPasswordRequestDto) {
    const { email } = data;
    let user: UserEntity = null;
    if (email) {
      user = await this.userRepo.findOne({ where: { email } });
    }
    if (!user) throw new UserNotFoundException();

    await this.canSendVerificationEmail(user, OTPTypeEnum.ForgetPassword);

    await this.userOtpRepo.update(
      { userId: user.id, isVerified: false, type: OTPTypeEnum.ForgetPassword },
      { expiredAt: new Date() },
    ); // Mark old token as expired
    const payload: JwtPayloadType = {
      id: user.id,
      email: user.email,
      username: user.username,
    };
    const resetToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const otp = await this.userOtpRepo.store({
      userId: user.id,
      type: OTPTypeEnum.ForgetPassword,
      senderType: OTPSenderTypeEnum.Email,
      code: generateOTPCode(),
      token: resetToken,
      expiredAt: new Date(Date.now() + FORGOT_PASSWORD_EXPIRATION * 60 * 1000), // 15 minutes
      receiver: user.email,
    });
    const emailData: ISendMail = {
      to: user.email,
      subject: 'Reset Password Request',
      template: mailTemplatePathConfig.forgotPasswordPath,
      context: {
        fullName: user.name ? user.name : user.email,
        activationCode: otp.code,
      },
    };
    await this.kafkaClientService.emit(sendMailQueueConfig.topic, emailData);
    return { resetToken: resetToken };
  }

  async verificationOTP(data: VerifyOtpRequestDto ) {
    const { resetToken, code } = data; 

    const payload: JwtPayloadType = await this.jwtService.verify(resetToken, {
      secret: jwtConfig.secret,
    });

    if (!payload.id) throw new TokenInvalidException();
    const user = await this.userRepo.findById(payload.id);
    if (!user) throw new UserNotFoundException();

    const otp = await this.userOtpRepo.findOne({
      where: { userId: user.id, token: resetToken },  
      order: {
        createdAt: 'DESC',
      },
    });

    if (!otp) {
      throw new CustomError(ErrorCodes.UserOtpNotfound, 'Token Invalid');
    }

    if (otp.isVerified || otp.token != resetToken || otp.code != code|| otp.isExpired()) {
      throw new CustomError(ErrorCodes.UserOtpInvalid, 'Token or otp invalid');
    }

    otp.isVerified = true;
    await this.userOtpRepo.save(otp);
    return true;
  }

  async resetPassword(data: ResetPasswordRequestDto) {
    const { resetToken, password } = data;

    const payload: JwtPayloadType = await this.jwtService.verify(resetToken, {
      secret: jwtConfig.secret,
    });
    if (!payload.id) throw new TokenInvalidException();
    const user = await this.userRepo.findById(payload.id);
    if (!user) throw new UserNotFoundException();

    const otp = await this.userOtpRepo.findOne({
      where: { userId: user.id, token: resetToken },
      order: {
        createdAt: 'DESC',
      },
    });

    if (!otp) {
      throw new CustomError(ErrorCodes.UserOtpNotfound, 'Token Invalid');
    }
    if (!otp.isVerified ||otp.token != resetToken || otp.isExpired()) {
      throw new CustomError(ErrorCodes.UserOtpInvalid, 'Token invalid');
    }

    user.password = password;
    await this.userRepo.save(user);
    return this.authenticate(user);
  }

  async authenticate(user: UserEntity): Promise<LoginResponseDto> {
    const payload: JwtPayloadType = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    const token = this.jwtService.sign(payload);
    const userDto = await this.me(user.id);
    return {
      user: userDto,
      token,
    };
  }

  async canSendVerificationEmail(
    user: UserEntity,
    otpType: OTPTypeEnum,
  ): Promise<void> {
    const cutoffTimeForResend = dayjs()
      .subtract(RESEND_VERIFICATION_CODE_DELAY_MINUTES, 'minute')
      .toDate();
    const lastOtp = await this.userOtpRepo.findOne({
      where: {
        userId: user.id,
        senderType: OTPSenderTypeEnum.Email,
        type: otpType,
        createdAt: MoreThan(cutoffTimeForResend),
      },
      order: {
        createdAt: 'DESC',
      },
    });
    if (lastOtp) {
      throw new BadRequestException(
        `You can only request a new verification code every ${RESEND_VERIFICATION_CODE_DELAY_MINUTES} minutes.`,
      );
    }
    return;
  }

  async canSendVerificationSMS(
    user: UserEntity,
    otpType: OTPTypeEnum,
  ): Promise<void> {
    const cutoffTimeForResend = dayjs()
      .subtract(RESEND_VERIFICATION_CODE_DELAY_MINUTES, 'minute')
      .toDate();
    const lastOtp = await this.userOtpRepo.findOne({
      where: {
        userId: user.id,
        senderType: OTPSenderTypeEnum.SMS,
        type: otpType,
        createdAt: MoreThan(cutoffTimeForResend),
      },
      order: {
        createdAt: 'DESC',
      },
    });
    if (lastOtp) {
      throw new BadRequestException(
        `You can only request a new verification code every ${RESEND_VERIFICATION_CODE_DELAY_MINUTES} minutes.`,
      );
    }
    return;
  }

  getLoginSocialState(params: CreateLoginSocialUrlRequestDto): string {
    return Buffer.from(JSON.stringify(params)).toString('base64');
  }

  parseLoginSocialState(params: string): CreateLoginSocialUrlRequestDto {
    try {
      const obj = JSON.parse(Buffer.from(params, 'base64').toString());
      return plainToInstance(CreateLoginSocialUrlRequestDto, obj);
    } catch (error) {
      this.logger.error('parseLoginSocialState error', error);
      return {};
    }
  }

  async linkSocial(userId: string, creds: LinkSocialRequestDto) {
    const isLinkWithSocial = await this.userSocialRepo.findOneBy({
      userId,
      socialType: creds.socialType,
    });
    if (isLinkWithSocial) {
      throw new BadRequestException(
        `This account is already linked to another ${creds.socialType} account . Please disconnect it from the current account.`,
      );
    }
    const authFactory = AuthFactory.create(creds.socialType);

    const authInfo: IUser = await authFactory.getUserInfo(creds.accessToken);
    const userSocial = await this.userSocialRepo.findOneBy({
      socialType: creds.socialType,
      socialId: authInfo.id,
    });
    if (userSocial && userSocial.userId !== userId) {
      throw new BadRequestException(
        `This ${creds.socialType} account is already linked to another account. Please disconnect it from the current account or use a different ${creds.socialType} account to proceed.`,
      );
    }
    const userSocialLinked = await this.userSocialRepo.store({
      userId,
      socialType: creds.socialType,
      socialId: authInfo.id,
      accessToken: creds.accessToken,
      refreshToken: creds.refreshToken,
    });

    return new UserSocialDto(userSocialLinked);
  }

  async unlinkSocial(user: UserEntity, payload: UnlinkSocialRequestDto) {
    const userId = user.id;
    // validate logic unlink
    if (!user.password || (!user.email && !user.username)) {
      const userSocials = await this.userSocialRepo.findBy({ userId });
      const existedSocial = userSocials.find(
        (social) =>
          social.socialType === payload.socialType &&
          social.socialId === payload.socialId,
      );
      if (!existedSocial) {
        throw new BadRequestException(
          `This ${payload.socialType} account is not linked to your account.`,
        );
      }
      if (userSocials.length === 1) {
        throw new BadRequestException(
          'You must have at least one social account linked to your account.',
        );
      }
    }
    const userSocialLinked = await this.userSocialRepo.delete({
      userId,
      socialType: payload.socialType,
      socialId: payload.socialId,
    });

    const successed = userSocialLinked.affected > 0;
    return successed;
  }
}
