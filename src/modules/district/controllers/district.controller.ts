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
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserDto, ProfileRankingResponseDto } from '@/common/dto/user.dto';
import { ApiOkResponse, AuthUser, UseGuardAuth } from '@/decorators';
import { DistrictService } from '../services/district.service';
import { CreateDistrictDto, DistrictDto, UpdateDistrictDto } from '../dto/district.dto';
import { RoleTypeEnum } from '../../../common';


@ApiTags('district')
@Controller('/districts')
@UseGuardAuth()
export class DistrictController {
  constructor(private readonly districtService: DistrictService) { }

  @Get('/districts')
  @ApiOkResponse({
    type: DistrictDto,
    isArray: true,
  })
  async getAllDistricts(): Promise<DistrictDto[]> {
    return this.districtService.findAll();
  }

  @Get('/:id')
  @ApiOkResponse({
    type: DistrictDto,
  })
  async getDistrictById(@Param('id') id: string): Promise<DistrictDto> {
    return this.districtService.findOne(id);
  }

  @Post('/')
  @ApiOkResponse({
    type: DistrictDto,
  })
  @UseGuardAuth({
    roles: [RoleTypeEnum.Admin]
  })
  async createDistrict(@AuthUser('id') userId: string, @Body() payload: CreateDistrictDto): Promise<DistrictDto> {
    return this.districtService.create(payload, userId);
  }
  
  @Put('/:id')
  @ApiOkResponse({
    type: DistrictDto,
  })
  @UseGuardAuth({
    roles: [RoleTypeEnum.Admin]
  })
  async updateDistrict(@Param('id') id: string, @Body() payload: UpdateDistrictDto): Promise<DistrictDto> {
    return this.districtService.update(id, payload);
  }

  @Delete('/:id')
  @ApiOkResponse({
    type: DistrictDto,
  })  
  @UseGuardAuth({
    roles: [RoleTypeEnum.Admin]
  })
  async removeDistrict(@Param('id') id: string): Promise<void> {
    return this.districtService.remove(id);
  }

}