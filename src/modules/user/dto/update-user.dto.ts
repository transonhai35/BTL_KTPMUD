import {
  IsString,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  Length,
  IsEnum,
  Matches,
  MaxLength,
  ValidateIf,
  IsUrl,
  IsUUID,
} from 'class-validator';
import { Gender } from '@/common/enums';
import { ToLowerCase, Trim } from '../../../decorators';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserRequestDto {
  @ApiPropertyOptional({
    description: 'User name',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  @Trim()
  @Matches(/^[a-zA-ZÀ-ỹ0-9\s'.,\-–_]+$/u, {
    message:
      'Name cannot contain special characters such as @, #, $, %, ^, &, *, or any other symbols.',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Username',
    example: 'john_doe',
  })
  @ValidateIf(
    (obj, value) => value !== '' && value !== null && value !== undefined,
  )
  @IsString()
  @Length(3, 100)
  @Matches(/^(?![.])[a-zA-Z0-9_-]+(?:[.][a-zA-Z0-9_-]+)*$/, {
    message:
      'Username must contain 3-100 letters or numbers. Please do not use spaces, symbols, or special characters.',
  })
  @Matches(/^[^`~{}<>\[\];'"|\\&$#%!*@]+$/, {
    message:
      'Username must contain 3-100 letters or numbers. Please do not use spaces, symbols, or special characters.',
  })
  @Trim()
  @ToLowerCase()
  username?: string;

  @ApiPropertyOptional({
    description: 'Avatar URL',
    example: 'http://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsString()
  @Trim()
  @IsUrl()
  avatar?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Trim()
  @IsUrl()
  @MaxLength(255)
  websiteLink?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Trim()
  @IsUrl()
  @MaxLength(255)
  instagramLink?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Trim()
  @IsUrl()
  @MaxLength(255)
  twitterLink?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Trim()
  @IsUrl()
  @MaxLength(255)
  facebookLink?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Trim()
  @IsUrl()
  @MaxLength(255)
  youtubeLink?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Trim()
  @IsUrl()
  @MaxLength(255)
  tiktokLink?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Trim()
  @MaxLength(255)
  merchandise?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Trim()
  about?: string;

  @IsOptional()
  @IsString()
  @Trim()
  @IsUUID()
  countryId?: string;
}


export class ApproveProfileViewerRequestDto {
  @ApiProperty({
    description: 'viewer id',
    example: 'string123456',
  })
  @IsString()
  viewerId: string;
}
