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
  UploadedFile,
  Query,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserDto, ProfileRankingResponseDto } from '@/common/dto/user.dto';
import { ApiOkResponse, AuthUser, UseGuardAuth } from '@/decorators';
import { AdminService } from '../services/admin.service';
import { UserProfilePageDto, UserResponseDto } from '../dto/admin.dto';
import { PageDto, RoleTypeEnum } from '../../../common';


@ApiTags('admin')
@Controller('/admins')
@UseGuardAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Get('/user-profiles')
  @ApiOkResponse({
      type: PageDto<UserResponseDto>,
    })
  @UseGuardAuth({
    roles: [RoleTypeEnum.Admin]
  })
  async userProfiles(
    @AuthUser('id') userId: string,
    @Query() payload: UserProfilePageDto
  ): Promise<PageDto<UserResponseDto>> {
    return this.adminService.findAllUserProfiles(payload);
  }

  @Get('search')
  @ApiOkResponse({
      type: UserResponseDto,
    })
  async search(@Query('q') keyword: string) {
    return this.adminService.searchUsers(keyword);
  }

  @Put('/:id')
  @ApiOkResponse({
    type: UserResponseDto,
  })
  @UseGuardAuth({
    roles: [RoleTypeEnum.Admin]
  })
  async updateStatus(
    @Param('id') id: string,
  ) {
    return this.adminService.toggleUserActivation(id);
  }

}