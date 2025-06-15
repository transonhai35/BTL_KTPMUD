import { Expose, Transform, Type } from 'class-transformer';
import { AccountTypeEnum, PageOptionsDto, RoleTypeEnum, UserSocialDto } from '../../../common';
import { UserEntity } from '../../database';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsStrongPassword, Length } from 'class-validator';
import { Trim } from '../../../decorators';

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


export class RegisterRequestDto {
  @ApiPropertyOptional({
    description: 'account type',
  })
  @IsEnum(AccountTypeEnum)
  @IsOptional()
  type: AccountTypeEnum = AccountTypeEnum.User;

  @ApiPropertyOptional({
    description: 'account role',
  })
  @IsEnum(RoleTypeEnum)
  @IsOptional()
  role: RoleTypeEnum = RoleTypeEnum.User;

  @ApiPropertyOptional({ example: 'John Doe', description: 'Name of the user' })
  @IsOptional()
  @Trim()
  name?: string;

  @ApiPropertyOptional({
    example: 'guest_123',
    description: 'Guest ID for temporary users',
  })
  @IsOptional()
  guestId?: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address for registration',
  })
  @IsEmail()
  @Trim()
  email: string;

  @ApiProperty({
    example: 'StrongPass123!',
    description: 'Password for the account',
    minLength: 6,
    maxLength: 16,
  })
  @Trim()
  @IsString()
  @IsNotEmpty()
  @Length(6, 16)
  @IsStrongPassword({
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;

  @Trim()
  @IsString()
  @IsOptional()
  ref?: string;
}