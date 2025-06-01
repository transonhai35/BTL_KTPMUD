import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { SocialTypeEnum, UserSocialDto } from '../../../common';

export class LinkSocialRequestDto {

  @IsEnum(SocialTypeEnum)
  socialType: SocialTypeEnum;

  @IsNotEmpty()
  @IsString()
  accessToken: string;

  @IsOptional()
  @IsString()
  refreshToken?: string;
}

export class LinkSocialResponseDto extends UserSocialDto {

  
}