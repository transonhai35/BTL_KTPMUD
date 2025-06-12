import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CommuneDto } from '../../commune/dto/commune.dto';
import { DistrictEntity } from '../../database/typeorm/entities/district';

export class CreateDistrictDto {
  @ApiProperty({
    description: 'Name of the district',
    example: 'District 1',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'List of communes in the district',
    required: false,
  })
  @IsOptional()
  communes?: CreateCommuneDto[];
}

export class CreateCommuneDto {
  @ApiProperty({
    description: 'Name of the commune',
    example: 'Commune 1',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class DistrictDto {
  @Expose()
  id: string;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  communes: CommuneDto[];

  @Expose()
  createdBy: string;

  constructor(props: Partial<DistrictEntity>) {
      return plainToInstance(DistrictDto, props, {
        excludeExtraneousValues: true,
        exposeUnsetFields: false,
      });
    }
}

export class UpdateDistrictDto {
  @ApiProperty({
    description: 'Name of the district',
    example: 'Updated District 1',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Code of the district ',
    required: false,
  })
  @IsOptional()
  code?: string;

}