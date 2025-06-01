import { Expose, plainToInstance } from 'class-transformer';
import { IsBoolean, IsEmail, IsNumber, IsString } from 'class-validator';
import { UserEntity } from '../../database';

export class UserMinifyDto {
  @IsNumber()
  @Expose()
  id: number;

  @IsString()
  @Expose()
  name?: string;

  @IsEmail()
  @Expose()
  email?: string;

  @IsString()
  @Expose()
  username?: string;

  @IsString()
  @Expose()
  avatar?: string;

  @IsBoolean()
  @Expose()
  emailVerified?: boolean;

  @IsBoolean()
  @Expose()
  phoneVerified?: boolean;

  @Expose()
  role: string;

  @Expose()
  type: string;

  @Expose()
  rank: string;

  @IsBoolean()
  @Expose()
  activated: boolean;

  constructor(props: Partial<UserEntity>) {
    return plainToInstance(UserMinifyDto, props, {
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
    });
  }
}
