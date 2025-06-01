import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SocialTypeEnum } from '../../../common';

export class UnlinkSocialRequestDto {

  @IsEnum(SocialTypeEnum)
  @IsNotEmpty()
  socialType: SocialTypeEnum;

  @IsNotEmpty()
  @IsString()
  socialId: string;
}