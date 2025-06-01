import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderDirectionEnum } from '../enums';

export class PageDto<T> {

  @ApiProperty()
  readonly total: number;

  @ApiProperty({ isArray: true })
  readonly items: T[];

  constructor(items: T[], total: number) {
    this.items = items;
    this.total = total;
  }
}



export class PageOptionsDto {

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  orderField?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(OrderDirectionEnum)
  orderDirection?: OrderDirectionEnum;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly limit: number = 10;

  get offset(): number {
    return (this.page - 1) * this.limit;
  }

  @ApiPropertyOptional()
  @IsString()
  // @IsNotEmpty()
  @IsOptional()
  readonly q?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly startTime?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly endTime?: string;

}
