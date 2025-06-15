import { Expose, plainToInstance, Type } from 'class-transformer';
import { CommuneEntity } from '../../database/typeorm/entities/commune';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { WaterSanitationPlanEntity } from '../../database/typeorm/entities/water-sanitation-plan';
import { PlanType } from '../../../common/enums/plan-type';
import { WaterPlanStatus } from '../../../common/enums/water-plan-status.enum';
import { PageOptionsDto } from '../../../common';


export class CreateWaterAccessIndicatorDto {
  @ApiProperty({
    description: 'The ratio of households using clean water',
    example: 0.85,
  })
  @IsNumber()
  @IsNotEmpty()
  accessRate: number;

  @ApiProperty({
    description: 'Number of water facilities',
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  numberOfFacilities: number;

  @ApiProperty({
    description: 'Water quality index',
    example: 90,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  waterQualityIndex?: number;

  @ApiProperty({
    description: 'ID of the associated water sanitation plan',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  waterSanitationPlanId: string;

  @ApiProperty({
    description: 'Metadata for additional information',
    example: { key: 'value' },
    required: false,
  })
  @IsOptional()
  meta?: Record<string, any>;

}

export class UpdateWaterAccessIndicatorDto extends CreateWaterAccessIndicatorDto {

}

export class WaterAccessIndicatorPageDto extends PageOptionsDto{

}