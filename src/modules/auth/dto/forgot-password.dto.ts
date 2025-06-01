import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';
import { UserDto } from '@/common/dto/user.dto';
import { Trim } from '../../../decorators';

// Request DTO for forgot password functionality
export class ForgotPasswordRequestDto {
  @ApiProperty({
    example: 'user@example.com',
    description:
      'The email address of the user who wants to reset their password',
  })
  @IsEmail()
  @Trim()
  @IsNotEmpty()
  email: string;
}

// Response DTO for forgot password functionality
export class ForgotPasswordResponseDto {
  @ApiProperty({
    example: 'jwt_token_12345',
    description: 'JWT token for the user after password reset',
  })
  resetToken: string;
}

// Request DTO for reset password functionality
export class ResetPasswordRequestDto {
  @ApiProperty({
    example: 'NewStrongPass123!',
    description: 'The new password for the user',
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

  @ApiProperty({
    example: 'jwt_token_12345',
    description: 'JWT token for the user after password reset',
  })
  resetToken: string;
}

// Response DTO for reset password functionality
export class ResetPasswordResponseDto {
  @ApiProperty({
    type: () => UserDto,
    description: 'Details of the user whose password was reset',
  })
  user: UserDto;

  @ApiProperty({
    example: 'jwt_token_12345',
    description: 'JWT token for the user after password reset',
  })
  token: string;
}

export class VerifyOtpRequestDto {
  @ApiProperty({
    example: '123456',
    description: 'Verification code sent to the user email',
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  code: string;

  @ApiProperty({
    example: 'jwt_token_12345',
    description: 'JWT token for the user after password reset',
  })
  resetToken: string;
}

