import { Expose, plainToInstance } from 'class-transformer';
import { CommuneEntity } from '../../database/typeorm/entities/commune';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CommuneDto {
  @Expose()
  id: string;

  @Expose()
  code: string;

  @Expose()
  name: string;

  constructor(props: Partial<CommuneEntity>) {
    return plainToInstance(CommuneDto, props, {
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
    });
  }
}

export class CreateCommuneDto {
  @ApiProperty({
    description: 'Name of the commune',
    example: 'Commune 1',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  districtId: string;

  @ApiProperty({
    description: 'Code of the commune',
    example: 'COMM-001',
  })
  @IsString()
  @IsOptional()
  code?: string;   
}

export class UpdateCommuneDto {
  @ApiProperty({
    description: 'Name of the commune',
    example: 'Updated Commune 1',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Code of the commune',
    required: false,
  })
  @IsOptional()
  code?: string;

}