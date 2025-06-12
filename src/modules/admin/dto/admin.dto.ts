import { Expose, Transform, Type } from 'class-transformer';
import { AccountTypeEnum, PageOptionsDto, RoleTypeEnum, UserSocialDto } from '../../../common';
import { UserEntity } from '../../database';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  code?: string;

  @Expose()
  name?: string;

  @Expose()
  dateOfBirth?: string;

  @Expose()
  email?: string;

  @Expose()
  phone?: string;

  @Expose()
  username?: string;

  @Expose()
  emailVerified?: boolean;

  @Expose()
  phoneVerified?: boolean;

  @Expose()
  avatar?: string;

  @Expose()
  role?: RoleTypeEnum;

  @Expose()
  type: AccountTypeEnum;

  @Expose()
  active?: boolean;

  @Expose()
  createdAt?: Date;

  @Expose()
  updatedAt?: Date;

  @Expose()
  @Type(() => UserSocialDto)
  socials?: UserSocialDto[];

  @Expose()
  about?: string;

  // User's legal information
  @Expose()
  portraitImage?: string;
  @Expose()
  idCardFront?: string;
  @Expose()
  idCardBack?: string;
  @Expose()
  socialSecurityNumber?: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}

export class UserProfilePageDto extends PageOptionsDto{

}
