import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Trim } from '../../../decorators';

export class ChangePasswordRequestDto {
  @ApiPropertyOptional({
    description: 'Current password of the user',
    example: 'oldPass123!'
  })
  @IsOptional()
  @IsString()
  @Trim()
  oldPassword?: string;

  @ApiProperty({
    description: 'New password that meets strength requirements',
    example: 'newStrongPass123!',
    required: true,
    minLength: 8,
    maxLength: 20
  })
  @Trim()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  })
  @Length(8, 20)
  newPassword: string;
}
