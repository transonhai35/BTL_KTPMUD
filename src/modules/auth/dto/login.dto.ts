import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserDto } from '@/common/dto/user.dto';
import { LoginSocialActionTypeEnum, SocialTypeEnum } from '../../../common/enums';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';
import { Trim } from '../../../decorators';
import { Expose } from 'class-transformer';

export class CreateLoginSocialUrlRequestDto {

  @IsOptional()
  @IsString()
  @Expose()
  state?: string;

  @IsOptional()
  @IsString()
  @Expose()
  ref?: string;

  @IsOptional()
  @IsEnum(LoginSocialActionTypeEnum)
  @Expose()
  action?: string;

  @ValidateIf(o => o.action === LoginSocialActionTypeEnum.LINK)
  @IsString()
  @Expose()
  token?: string;
}

// Request DTO for login with email and password
export class LoginRequestDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email for login',
  })
  @IsNotEmpty()
  @Trim()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    example: true,
    description: 'If admin access is required',
  })
  @IsOptional()
  requiredAdmin?: boolean;

  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'User password for login',
  })
  @IsNotEmpty()
  @Trim()
  @Length(8, 64)
  password: string;
}

// Request DTO for login with social account
export class LoginSocialRequestDto {
  @ApiProperty({ enum: SocialTypeEnum, description: 'Type of social login' })
  @IsNotEmpty()
  socialType: SocialTypeEnum;

  @ApiPropertyOptional({
    example: 'access_token_12345',
    description: 'Access token for social login',
  })
  @IsNotEmpty()
  accessToken?: string;

  @ApiPropertyOptional({
    example: 'refresh_token_67890',
    description: 'Optional refresh token for social login',
  })
  @IsOptional()
  refreshToken?: string;

  @ApiPropertyOptional({
    example: 'guest_123',
    description: 'Optional guest ID for social login',
  })
  @IsOptional()
  guestId?: string;

  @ApiPropertyOptional({
    example: 'ref_123',
    description: 'Referral code',
  })
  @IsOptional()
  ref?: string;
}


// Response DTO for login
export class LoginResponseDto {
  @ApiProperty({ type: () => UserDto, description: 'User details' })
  @IsNotEmpty()
  user: UserDto;

  @ApiProperty({
    example: 'jwt_token_12345',
    description: 'JWT token for authentication',
  })
  @IsNotEmpty()
  token: string;

  @ApiPropertyOptional({
    example: 'Login successful',
    description: 'Optional success message',
  })
  @IsOptional()
  message?: string;
}

// Request DTO for OAuth2 login flow with authorization code
export class LoginOAuth2CodeRequestDto {
  @ApiProperty({ enum: [SocialTypeEnum.Facebook, SocialTypeEnum.Google, SocialTypeEnum.Instagram, SocialTypeEnum.Twitter], description: 'Type of social login' })
  @IsNotEmpty()
  @IsEnum(SocialTypeEnum)
  @IsString()
  socialType: SocialTypeEnum;

  @ApiProperty({
    example: 'authorization_code_12345',
    description: 'Authorization code from OAuth2 flow',
  })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiPropertyOptional({
    example: 'state_123',
    description: 'Authorization state login',
  })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({
    description: 'Redirect Uri to authorization',
  })
  @IsString()
  @IsOptional()
  redirectUri?: string;
}

export class OAuth2CallbackRequestDto {

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  error?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  error_description?: string;

  @ApiPropertyOptional({
    example: 'authorization_code_12345',
    description: 'Authorization code from OAuth2 flow',
  })
  @ValidateIf(o => !o.error)
  @IsString()
  code?: string;

  @ApiPropertyOptional({
    example: 'state_123',
    description: 'Authorization state login',
  })
  @IsString()
  @IsOptional()
  state?: string;
}
