import { Expose, plainToInstance, Type } from 'class-transformer';
import { CommuneEntity } from '../../database/typeorm/entities/commune';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { WaterSanitationPlanEntity } from '../../database/typeorm/entities/water-sanitation-plan';
import { PlanType } from '../../../common/enums/plan-type';
import { WaterPlanStatus } from '../../../common/enums/water-plan-status.enum';

export class WaterSanitationPlanDto {
  @Expose()
  id: string;

  @Expose()
  code: string;

  @Expose()
  name: string;

  constructor(props: Partial<WaterSanitationPlanEntity>) {
    return plainToInstance(WaterSanitationPlanDto, props, {
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
    });
  }
}

export class CreateWaterSanitationPlanDto {
  @ApiProperty({
    description: 'Name of the water sanitation plan',
    example: 'Water Sanitation Plan 1',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Location of the water sanitation plan',
    example: 'Location 1',
    required: false,
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({
    description: 'Plan type',
    enum: PlanType,
    example: PlanType.water,
  })
  @IsEnum(PlanType)
  @IsNotEmpty()
  planType: PlanType;

  @ApiProperty({
    description: 'Status of the water sanitation plan',
    enum: WaterPlanStatus,
    example: WaterPlanStatus.inProgress,
  })
  @IsEnum(WaterPlanStatus)
  @IsNotEmpty()
  status: WaterPlanStatus;

  @ApiProperty({
    description: 'Commune ID',
    example: 'b3a1f8e4-8321-4f2f-90fd-0f1d60d2c9a7',
  })
  @IsUUID()
  @IsNotEmpty()
  communeId: string;

  @ApiProperty({
    description: 'Description of the plan',
    example: 'Plan to improve water quality...',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Start date of the plan',
    example: '2025-06-01',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  startDate: Date;  

  @ApiProperty({
    description: 'End date of the plan',
    example: '2025-06-30',
    required: false,
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @ApiProperty({
    description: 'Assigned people/usernames/emails',
    example: ['user1@example.com', 'user2@example.com'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  assign?: string[];

  @ApiProperty({
    description: 'Attached files metadata',
    example: {
      fileName: 'plan.pdf',
      url: 'https://example.com/files/plan.pdf',
    },
    required: false,
  })
  @IsOptional()
  attachedFiles?: object;

}

export class UpdateWaterSanitationPlanDto extends CreateWaterSanitationPlanDto {

}