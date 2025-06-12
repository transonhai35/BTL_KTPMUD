import {
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
import { UserProfilePageDto, UserResponseDto } from '../dto/admin.dto';
import { PageDto, UserDto } from '../../../common';
import { Like } from 'typeorm';


@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private readonly userRepo: UserRepository,
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

}
