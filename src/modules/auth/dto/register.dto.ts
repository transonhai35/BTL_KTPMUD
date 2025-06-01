import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';
import { LoginResponseDto } from './login.dto';
import { Trim } from '../../../decorators';
import { AccountTypeEnum } from '../../../common';

// Request DTO for user registration
export class RegisterRequestDto {
  @ApiPropertyOptional({
    description: 'account type',
  })
  @IsEnum(AccountTypeEnum)
  @IsOptional()
  type: AccountTypeEnum = AccountTypeEnum.User;


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

// Response DTO for user registration
export class RegisterResponseDto extends LoginResponseDto { }
