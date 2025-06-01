import { plainToInstance } from 'class-transformer';
import { UserEntity } from '@/modules/database';
import { UserMinifyDto } from '../dto/query-user.dto';
import { UserDto } from '../../../common/dto/user.dto';

export class UserMapper {
  static toMinifyDto(user: UserEntity): UserMinifyDto {
    return plainToInstance(UserMinifyDto, user, {
      excludeExtraneousValues: true,
    });
  }

  static toMinifyDtos(users: UserEntity[]): UserMinifyDto[] {
    return plainToInstance(UserMinifyDto, users, {
      excludeExtraneousValues: true,
    });
  }

  static toDtos(users: UserEntity[]): UserDto[] {
    return plainToInstance(UserDto, users, {
      excludeExtraneousValues: true,
    });
  }
}
