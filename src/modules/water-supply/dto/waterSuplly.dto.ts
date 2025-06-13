import { Expose, plainToInstance, Type } from 'class-transformer';
import { CommuneEntity } from '../../database/typeorm/entities/commune';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { WaterSanitationPlanEntity } from '../../database/typeorm/entities/water-sanitation-plan';
import { PlanType } from '../../../common/enums/plan-type';
import { WaterPlanStatus } from '../../../common/enums/water-plan-status.enum';
import { WaterSupplyEnum } from '../../../common/enums/water-supply.enum';

export class CreateWaterSupplyDto {
  @ApiProperty({
    description: 'Name of the water supply plan',
    example: 'Water Supply Plan 1',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Status of the water supply plan',
    example: 'active',
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    description: 'Location of the water supply plan',
    example: 'Location 1',
    required: false,
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({
    description: 'Water supply type',
    enum: WaterSupplyEnum,
    example: WaterSupplyEnum.CENTRALIZED,
  })
  @IsEnum(WaterSupplyEnum)
  type: WaterSupplyEnum;

  @ApiProperty({
    description: 'Capacity of the water supply plan in liters',
    example: 1000,
  })
  @IsOptional()
  @IsNumber()
  capacity?: number;

 @ApiProperty({ description: '', example: 2005 })
  @IsOptional()
  @IsNumber()
  constructionYear?: number;

  @ApiProperty({ description: '', example: 120 })
  @IsOptional()
  @IsNumber()
  householdCount?: number;

  @ApiProperty({
    description: '',
    example: { createdBy: 'admin', regionCode: 'X01' },
  })
  @IsOptional()
  @IsObject()
  meta?: Record<string, any>;

  @ApiProperty({ description: '' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Assigned people/usernames/emails',
    example: ['user1@example.com', 'user2@example.com'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  owner?: string[];
}

export class UpdateWaterSupplyDto extends CreateWaterSupplyDto {

}