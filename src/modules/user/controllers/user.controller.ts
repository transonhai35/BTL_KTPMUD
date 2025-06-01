import {
  Controller,
  Body,
  Delete,
  Put,
  Post,
  UsePipes,
  ValidationPipe,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { UserDto, ProfileRankingResponseDto } from '@/common/dto/user.dto';
import { ApiOkResponse, AuthUser, UseGuardAuth } from '@/decorators';
import { ApproveProfileViewerRequestDto, UpdateUserRequestDto } from '../dto/update-user.dto';
import { ChangePasswordRequestDto } from '../dto/change-password';
import {
  SendOtpToEmailRequestDto,
  SendOtpToEmailResponseDto,
  VerifyEmailRequestDto,
} from '../dto/verify-personal-info.dto';
import { AccountTypeEnum } from '../../../common';
import { PageUserDto, SearchUsersDto } from '../dto/search-user.dto';

@ApiTags('users')
@Controller('/users')
@UseGuardAuth()
export class UserController {
  constructor(private readonly userService: UserService) { }

  /**
   * Retrieves the authenticated user's profile.
   * This endpoint returns the profile information of the currently authenticated user.
   */
  @Get('/profile')
  @ApiOkResponse({
    type: UserDto,
  })
  getProfile(@AuthUser('id') userId: string): Promise<UserDto> {
    return this.userService.getProfile(userId);
  }

  /**
  * Check if a user exists by ID before sending an invite.
  * Returns true if found, otherwise throws 404.
  */
  @Get('/check/:code')
  @ApiOkResponse({type: Boolean})
  async checkUserCodeExists(
    @Param('code') code: string
  ) {
    const user = await this.userService.getUserByCode(code);
    
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return true;
  }

  /**
   * Updates the authenticated user's profile.
   * This endpoint accepts updated profile data and returns the updated user profile.
   */
  @Put('/update-profile')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOkResponse({
    type: UserDto,
  })
  updateProfile(@Body() payload: UpdateUserRequestDto): Promise<UserDto> {
    return this.userService.updateProfile(payload);
  }

  /**
   * Changes the user's password.
   * This endpoint accepts current and new password details, changes the user's password, and returns the updated profile.
   */
  @Put('/change-password')
  @ApiOkResponse({
    type: UserDto,
  })
  changePassword(@Body() payload: ChangePasswordRequestDto): Promise<UserDto> {
    return this.userService.changePassword(payload);
  }

  /**
   * Initiates an email update process.
   * This endpoint sends an OTP to the new email address for verification and returns a response indicating the status of the update request.
   */
  @Post('/update-email')
  @ApiOkResponse({
    type: SendOtpToEmailResponseDto,
  })
  async updateEmail(
    @Body() payload: SendOtpToEmailRequestDto,
  ): Promise<SendOtpToEmailResponseDto> {
    return this.userService.updateEmail(payload);
  }

  /**
   * Verifies the user's email.
   * This endpoint accepts a verification request, validates the provided OTP, and returns a boolean indicating whether the email was successfully verified.
   */
  @Post('/verify-email')
  @ApiOkResponse({
    type: Boolean,
  })
  async verifyEmail(@Body() payload: VerifyEmailRequestDto): Promise<boolean> {
    return this.userService.verifyEmail(payload);
  }

  /**
   * Deletes the authenticated user's account.
   * This endpoint permanently removes the user account and returns a boolean indicating the success of the operation.
   */
  @Delete('/delete-account')
  @ApiOkResponse({
    type: Boolean,
  })
  removeUser(): Promise<boolean> {
    return this.userService.removeUser();
  }

  /**
   * Search for an user by email and name
   */
  @Get('/search-rank')
  @ApiOkResponse({
    type: PageUserDto,
  })
  @UseGuardAuth({
    accountTypes: [AccountTypeEnum.Business, AccountTypeEnum.University]
  })
  search(@Query() payload: SearchUsersDto): Promise<PageUserDto> {
    return this.userService.search(payload);
  }

}
