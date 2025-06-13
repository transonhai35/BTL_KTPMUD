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
import { WaterSanitationPlanService } from '../services/waterSanitationPlan.service';
import { CreateWaterSanitationPlanDto, UpdateWaterSanitationPlanDto, WaterSanitationPlanDto } from '../dto/waterSanitationPlan.dto';
import { WaterSanitationPlanEntity } from '../../database/typeorm/entities/water-sanitation-plan';


@ApiTags('water-sanitation-plans')
@Controller('/water-sanitation-plans')
@UseGuardAuth()
export class WaterSanitationPlanController {
  constructor(private readonly waterSanitationPlanService: WaterSanitationPlanService) { }

  @Get('/list')
  @ApiOkResponse({
    type: WaterSanitationPlanDto,
    isArray: true,
  })
  getAllWaterSanitationPlans(): Promise<WaterSanitationPlanEntity[]> {
    return this.waterSanitationPlanService.findAll();
  }

  @Get('/:id')
  @ApiOkResponse({
    type: WaterSanitationPlanDto,
  })
  getWaterSanitationPlanById(@Param('id') id: string): Promise<WaterSanitationPlanEntity> {
    return this.waterSanitationPlanService.findOne(id);
  }

  @Post('/')
  @ApiOkResponse({
    type: WaterSanitationPlanDto,
  })
  @UseGuardAuth({
    roles: [RoleTypeEnum.Admin]
  })
  createWaterSanitationPlan(@AuthUser('id') userId: string, @Body() payload: CreateWaterSanitationPlanDto): Promise<WaterSanitationPlanEntity> {
    return this.waterSanitationPlanService.create(payload, userId);
  }
  
  @Put('/:id')
  @ApiOkResponse({
    type: WaterSanitationPlanDto,
  })
  @UseGuardAuth({
    roles: [RoleTypeEnum.Admin]
  })
  updateWaterSanitationPlan(@Param('id') id: string, @Body() payload: UpdateWaterSanitationPlanDto): Promise<WaterSanitationPlanEntity> {
    return this.waterSanitationPlanService.update(id, payload);
  }

  @Delete('/:id')
  @ApiOkResponse({
    type: WaterSanitationPlanDto,
  })
  @UseGuardAuth({
    roles: [RoleTypeEnum.Admin]
  })
  removeWaterSanitationPlan(@Param('id') id: string): Promise<void> {
    return this.waterSanitationPlanService.remove(id);
  }

}