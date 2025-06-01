/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { LoginRequestDto, LoginResponseDto } from '../dto/login.dto';
import { AuthService } from '../services/auth.service';
import { AuthUser, UseGuardAuth, ApiOkResponse } from '@/decorators';
import { UserEntity } from '@/modules/database';
import { UserDto } from '@/common/dto/user.dto';
import { Request, Response } from 'express';
import { RegisterRequestDto, RegisterResponseDto } from '../dto/register.dto';
import {
  SendVerificationEmailRequestDto,
  SendVerificationEmailResponseDto,
  VerifyAccountRequestDto,
} from '../dto/verify-account.dto';
import {
  ForgotPasswordRequestDto,
  ForgotPasswordResponseDto,
  ResetPasswordRequestDto,
  ResetPasswordResponseDto,
  VerifyOtpRequestDto,
} from '../dto/forgot-password.dto';

import { JwtService } from '@nestjs/jwt';
import {
  LinkSocialRequestDto,
  LinkSocialResponseDto,
} from '../dto/link-social.dto';
import { UnlinkSocialRequestDto } from '../dto/unlink-social.dto';

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Retrieves the currently authenticated user's details.
   * This endpoint returns the user information for the authenticated user.
   */
  @Get('/me')
  @UseGuardAuth()
  @ApiOkResponse({
    type: UserDto,
  })
  async me(@AuthUser('id') id: string) {
    return this.authService.me(id);
  }

  /**
   * Authenticates a user using their login credentials.
   * This endpoint validates the login credentials and returns a token on success.
   */
  @Post('/login')
  @ApiOkResponse({
    type: LoginResponseDto,
  })
  login(@Body() payload: LoginRequestDto) {
    return this.authService.login(payload);
  }

  /**
   * Registers a new user.
   * This endpoint accepts user registration details and creates a new user.
   */
  @Post('/register')
  @UsePipes(new ValidationPipe({ whitelist: true })) // Remove unauthorized fields
  @ApiOkResponse({
    type: RegisterResponseDto,
  })
  register(@Body() payload: RegisterRequestDto) {
    return this.authService.register(payload);
  }

  /**
   * Verifies a user's account.
   * This endpoint verifies a user account based on the provided verification details.
   */
  @UseGuardAuth()
  @Post('/verify-account')
  @ApiOkResponse({
    type: Boolean,
  })
  verifyAccount(@Body() params: VerifyAccountRequestDto) {
    return this.authService.verifyAccount(params);
  }

  /**
   * Authenticates a user using a token.
   * This endpoint returns the authenticated user's details based on the provided token.
   */
  @Post('/with-token')
  @UseGuardAuth()
  @ApiOkResponse({
    type: UserDto,
  })
  async loginWithToken(@AuthUser() user: UserEntity) {
    return this.authService.authenticate(user);
  }

  /**
   * Generates an authentication token for debugging purposes.
   * This endpoint returns an auth token for a given user if the debug token is provided.
   */
  @Get('/--gen-auth-token--')
  @ApiExcludeEndpoint()
  async getAuthToken(@Req() req: Request) {
    if (req.query._token != 'tadebug') throw new NotFoundException();
    const userId = req.query._userId as unknown as string;
    return this.authService.authenticate({
      id: userId,
      email: 'test@gmail.com',
    } as UserEntity);
  }

  /**
   * Resends the account verification email.
   * This endpoint triggers a new verification email to be sent to the user.
   */
  @Post('/resend-verification-email')
  @ApiOkResponse({
    type: SendVerificationEmailResponseDto,
  })
  resendVerificationEmail(@Body() payload: SendVerificationEmailRequestDto) {
    return this.authService.resendVerificationEmail(payload);
  }

  /**
   * Initiates the forgot password process.
   * This endpoint sends a password reset email based on the provided email address.
   */
  @Post('/forgot-password')
  @ApiOkResponse({
    type: ForgotPasswordResponseDto,
  })
  forgotPassword(@Body() payload: ForgotPasswordRequestDto) {
    return this.authService.forgotPassword(payload);
  }

    /**
   * auth verification
   * This endpoint accepts a reset token and otp update the user password.
   */
  @Post('/verification-otp')
  @ApiOkResponse({
    type: ResetPasswordResponseDto,
  })
  verificationOTP(
    @Body() payload: VerifyOtpRequestDto,
  ) {
    return this.authService.verificationOTP(payload);
  }


  /**
   * Resets a user's password.
   * This endpoint accepts a reset token and new password details to update the user password.
   */
  @Post('/reset-password')
  @ApiOkResponse({
    type: ResetPasswordResponseDto,
  })
  resetPassword(
    @Body() payload: ResetPasswordRequestDto,
  ) {
    return this.authService.resetPassword(payload);
  }

  /**
   * Links a social account to the authenticated user.
   * This endpoint associates a social login with the user's account.
   */
  @Post('/link-social')
  @UseGuardAuth()
  @ApiOkResponse({
    type: LinkSocialResponseDto,
  })
  async linkSocial(
    @Body() payload: LinkSocialRequestDto,
    @AuthUser('id') userId: string,
  ) {
    await this.authService.linkSocial(userId, payload);
  }

  /**
   * Unlinks a social account from the authenticated user.
   * This endpoint removes an associated social account from the user's profile.
   */
  @Post('/unlink-social')
  @UseGuardAuth()
  @ApiOkResponse({
    type: Boolean,
  })
  async unlinkSocial(
    @Body() payload: UnlinkSocialRequestDto,
    @AuthUser() user: UserEntity,
  ) {
    return this.authService.unlinkSocial(user, payload);
  }
}
