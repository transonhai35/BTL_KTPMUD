import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

// Request DTO for verifying an account
export class VerifyAccountRequestDto {
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

  @ApiPropertyOptional({
    example: 'verification_token_12345',
    description: 'Optional token for verification',
  })
  @IsString()
  @IsNotEmpty()
  token?: string;
}

// Request DTO for sending a verification email
export class SendVerificationEmailRequestDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address to send the verification code to',
  })
  @IsEmail()
  email: string;
}

// Response DTO for sending a verification email
export class SendVerificationEmailResponseDto {
  @ApiProperty({
    example: 'Verification email sent successfully',
    description: 'Message describing the result of the operation',
  })
  message: string;

  @ApiProperty({
    example: true,
    description: 'Indicates whether the operation was successful',
  })
  success: boolean;
}
