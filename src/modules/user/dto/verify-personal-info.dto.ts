import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';
import { Trim } from '../../../decorators';
import { ApiProperty, ApiTags } from '@nestjs/swagger';


export class VerifyPhoneRequestDto {
  @ApiProperty({
    description: 'OTP code for phone verification',
    example: '123456',
    minLength: 6,
    maxLength: 6
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  code: string;
}


export class SendOtpToPhoneRequestDto {
  @ApiProperty({
    description: 'Phone number to send OTP',
    example: '+1234567890',
    maxLength: 20
  })
  @IsNotEmpty()
  @IsPhoneNumber(null, { message: 'Please provide a valid phone number.' })
  @Length(1, 20)
  @Trim()
  phone?: string;
}


export class SendOtpToPhoneResponseDto {
  @ApiProperty({
    description: 'Response message',
    example: 'OTP sent successfully'
  })
  message: string;

  @ApiProperty({
    description: 'Operation success status',
    example: true
  })
  success: boolean;
}


export class VerifyEmailRequestDto {
  @ApiProperty({
    description: 'OTP code for email verification',
    example: '123456',
    minLength: 6,
    maxLength: 6
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  code: string;
}

export class SendOtpToEmailRequestDto {
  @ApiProperty({
    description: 'Email address to send OTP',
    example: 'example@example.com',
  })
  @IsNotEmpty()
  @Length(1, 254)
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @Trim()
  email?: string;
}

export class SendOtpToEmailResponseDto {
  message: string;
  success: boolean;
}
