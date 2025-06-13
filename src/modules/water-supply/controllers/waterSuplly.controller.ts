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
import { ApiOkResponse, AuthUser, UseGuardAuth } from '@/decorators';
import { RoleTypeEnum } from '../../../common';
import { WaterSanitationPlanEntity } from '../../database/typeorm/entities/water-sanitation-plan';
import { WaterSupplyService } from '../services/waterSuplly.service';
import { WaterSupplyEntity } from '../../database/typeorm/entities/water-supply';
import { CreateWaterSupplyDto, UpdateWaterSupplyDto } from '../dto/waterSuplly.dto';


@ApiTags('water-supply')
@Controller('/water-supply')
@UseGuardAuth()
export class WaterSupplyController {
  constructor(private readonly waterSupplyService: WaterSupplyService) { }

  @Get('/list')
  getAllWaterSupplies(): Promise<WaterSupplyEntity[]> {
    return this.waterSupplyService.findAll();
  }

  @Get('/:id')
  getWaterSupplyById(@Param('id') id: string): Promise<WaterSupplyEntity> {
    return this.waterSupplyService.findOne(id);
  }

  @Post('/')
  @UseGuardAuth({
    roles: [RoleTypeEnum.Admin]
  })
  createWaterSupply(@AuthUser('id') userId: string, @Body() payload: CreateWaterSupplyDto): Promise<WaterSupplyEntity> {
    return this.waterSupplyService.create(payload, userId);
  }
  
  @Put('/:id')
  @UseGuardAuth({
    roles: [RoleTypeEnum.Admin]
  })
  updateWaterSupply(@Param('id') id: string, @Body() payload: UpdateWaterSupplyDto): Promise<WaterSupplyEntity> {
    return this.waterSupplyService.update(id, payload);
  }

  @Delete('/:id')

  @UseGuardAuth({
    roles: [RoleTypeEnum.Admin]
  })
  removeWaterSupply(@Param('id') id: string): Promise<void> {
    return this.waterSupplyService.remove(id);
  }

}