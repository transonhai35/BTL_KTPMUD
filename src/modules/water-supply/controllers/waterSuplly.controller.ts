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
import { WaterSanitationPlanEntity } from '../../database/typeorm/entities/water-sanitation-plan';
import { WaterSupplyService } from '../services/waterSuplly.service';
import { WaterSupplyEntity } from '../../database/typeorm/entities/water-supply';
import { CreateWaterSupplyDto, UpdateWaterSupplyDto, WaterSupplyPageDto } from '../dto/waterSuplly.dto';


@ApiTags('water-supply')
@Controller('/water-supply')
@UseGuardAuth()
export class WaterSupplyController {
  constructor(private readonly waterSupplyService: WaterSupplyService) { }

  @Get('/list')
  async getAllWaterSupplies(@Query() payload: WaterSupplyPageDto): Promise<PageDto<WaterSupplyEntity>> {
    return this.waterSupplyService.findAll(payload);
  }

  @Get('/:id')
  async getWaterSupplyById(@Param('id') id: string): Promise<WaterSupplyEntity> {
    return this.waterSupplyService.findOne(id);
  }

  @Post('/')
  @UseGuardAuth({
    roles: [RoleTypeEnum.Admin]
  })
  async createWaterSupply(@AuthUser('id') userId: string, @Body() payload: CreateWaterSupplyDto): Promise<WaterSupplyEntity> {
    return this.waterSupplyService.create(payload, userId);
  }
  
  @Put('/:id')
  @UseGuardAuth({
    roles: [RoleTypeEnum.Admin]
  })
  async updateWaterSupply(@Param('id') id: string, @Body() payload: UpdateWaterSupplyDto): Promise<WaterSupplyEntity> {
    return this.waterSupplyService.update(id, payload);
  }

  @Put('/:id/business')
  async updateWaterSupplyByBiz(@AuthUser('id') bizId: string, @Param('id') id: string, @Body() payload: UpdateWaterSupplyDto): Promise<WaterSupplyEntity> {
    return this.waterSupplyService.updateByBiz(bizId, id, payload);
  }


  @Delete('/:id')

  @UseGuardAuth({
    roles: [RoleTypeEnum.Admin]
  })
  async removeWaterSupply(@Param('id') id: string): Promise<void> {
    return this.waterSupplyService.remove(id);
  }

}