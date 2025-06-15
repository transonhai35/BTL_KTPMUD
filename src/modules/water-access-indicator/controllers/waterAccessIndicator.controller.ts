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
import { ApiOkResponse, AuthUser, UseGuardAuth } from '@/decorators';
import { PageDto, RoleTypeEnum } from '../../../common';
import { WaterAccessIndicatorService } from '../services/waterAccessIndicator.service';
import { WaterSanitationPlanEntity } from '../../database/typeorm/entities/water-sanitation-plan';
import { Payload } from '@nestjs/microservices';
import { CreateWaterAccessIndicatorDto, UpdateWaterAccessIndicatorDto, WaterAccessIndicatorPageDto } from '../dto/waterAccessIndicator.dto';
import { WaterAccessIndicatorEntity } from '../../database/typeorm/entities/water-access-indicator';


@ApiTags('water-access-indicator')
@Controller('/water-access-indicator')
@UseGuardAuth()
export class WaterAccessIndicatorController {
  constructor(private readonly waterAccessIndicatorService: WaterAccessIndicatorService) { }

  @Get('/list')
  async getAllWaterAccessIndicators(
    @Query() payload: WaterAccessIndicatorPageDto
  ): Promise<PageDto<WaterAccessIndicatorEntity>> {
    return this.waterAccessIndicatorService.findAll(payload);
  }

  @Get('/:id')
  async getWaterAccessIndicatorById(@Param('id') id: string): Promise<WaterAccessIndicatorEntity> {
    return this.waterAccessIndicatorService.findOne(id);
  }

  @Post('/')
  async createWaterAccessIndicator(@AuthUser('id') userId: string, @Body() payload: CreateWaterAccessIndicatorDto): Promise<WaterAccessIndicatorEntity> {
    return this.waterAccessIndicatorService.create(payload, userId);
  }
  
  @Put('/:id')
  @UseGuardAuth({
    roles: [RoleTypeEnum.Admin]
  })
  async updateWaterAccessIndicator(@Param('id') id: string, @Body() payload: UpdateWaterAccessIndicatorDto): Promise<WaterAccessIndicatorEntity> {
    return this.waterAccessIndicatorService.update(id, payload);
  }

  @Delete('/:id')
  @UseGuardAuth({
    roles: [RoleTypeEnum.Admin]
  })
  async removeWaterAccessIndicator(@Param('id') id: string): Promise<void> {
    return this.waterAccessIndicatorService.remove(id);
  }

}