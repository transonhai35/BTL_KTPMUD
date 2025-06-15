import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CommuneRepository,
  DistrictRepository,
  UserEntity,
  UserRepository,
} from '@/modules/database';
import { RegisterRequestDto, UserProfilePageDto, UserResponseDto } from '../dto/admin.dto';
import { PageDto, UserDto } from '../../../common';
import { Like } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { AuthService } from '../../auth/services/auth.service';


@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);


  constructor(
    private readonly userRepo: UserRepository,
    private readonly authService: AuthService,
  ) {}

    async findAllUserProfiles(payload: UserProfilePageDto): Promise<PageDto<UserResponseDto>> {
      const { limit = 10, page = 1 } = payload;

      const [users, total] = await this.userRepo.findAndCount({
        take: limit,
        skip: (page - 1) * limit,
      });

      const results = users.map(user => {
        return new UserResponseDto(user);
      });

      return new PageDto<UserResponseDto>(results, total);
    }

    async searchUsers(keyword: string): Promise<UserEntity[]> {
      return this.userRepo.find({
        where: [
          { name: Like(`%${keyword}%`) },
          { email: Like(`%${keyword}%`) },
          { phone: Like(`%${keyword}%`) },
          { username: Like(`%${keyword}%`) },
        ],
      });
    }

    async toggleUserActivation(userId: string): Promise<UserEntity> {
      const user = await this.userRepo.findOneByOrFail({ id: userId });
      user.activated = !user.activated;
      return this.userRepo.save(user);
    }

    @Transactional()
    async registerUser(data: RegisterRequestDto) {
      const { email, guestId, password } = data;
      let user: UserEntity = null;
      user = await this.userRepo.findOneBy({ email });
      if (user) throw new BadRequestException('Email already exists');
      const referral = await this.userRepo.findOne({ where: { code: data.ref } });
      const registerBody = {
        ...data,
        referredBy: referral ? referral.id : null,
      };
      user = await this.userRepo.store(registerBody);
      await this.authService.sendVerificationEmail(user);
      return this.authService.authenticate(user);
    }

}
