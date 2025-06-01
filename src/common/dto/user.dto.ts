import { Expose, Transform, Type, plainToInstance } from 'class-transformer';
import { AccountTypeEnum, RoleTypeEnum, SocialTypeEnum } from '../enums';
import { UserEntity, UserSocialEntity } from '../../modules/database';
import { NetWorthRankEnum } from '../enums/net-worth-ranks.enum';

export class UserDto {
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
  @Transform(({ obj: userEntity }: { obj: UserEntity }) => !!userEntity.password)
  hasPassword?: boolean;

  @Expose()
  @Type(() => UserSocialDto)
  socials?: UserSocialDto[];

  @Expose()
  about?: string;

  @Expose()
  rank: NetWorthRankEnum;

  // User's legal information
  @Expose()
  portraitImage?: string;
  @Expose()
  idCardFront?: string;
  @Expose()
  idCardBack?: string;
  @Expose()
  socialSecurityNumber?: string;

  constructor(props: Partial<UserEntity>) {
    return plainToInstance(UserDto, props, {
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
    });
  }
}

export class UserSocialDto {
  @Expose()
  id: string;

  @Expose()
  socialType?: SocialTypeEnum;

  @Expose()
  socialId?: string;

  constructor(props: Partial<UserSocialEntity>) {
    return plainToInstance(UserSocialDto, props, {
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
    });
  }
}

export class ProfileRankingResponseDto {
  @Expose()
  userId: string;

  @Expose()
  code?: string;

  @Expose()
  name?: string;

  @Expose()
  tierName?: string;

  @Expose()
  avatar?: string;

  @Expose()
  totalBalance?: number;

  @Expose()
  isUpgraded?: boolean;

  constructor(partial: Partial<ProfileRankingResponseDto>) {
    Object.assign(this, partial);
  }
}


