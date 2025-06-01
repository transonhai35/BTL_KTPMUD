
import {
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from '../../../common';
import { NetWorthRankEnum } from '../../../common/enums/net-worth-ranks.enum';
import { UserMinifyDto } from './query-user.dto';

export class SearchUsersDto extends PageOptionsDto {

  @ApiProperty({
    description: 'Search rank'
  })
  @IsEnum(NetWorthRankEnum)
  @IsOptional()
  rank?: NetWorthRankEnum;
}

export class PageUserDto {

  @ApiProperty({ isArray: true, type: UserMinifyDto })
  items: UserMinifyDto[];

  @ApiProperty()
  total: number;


  constructor(items: UserMinifyDto[], total: number) {
    this.items = items;
    this.total = total;
  }
}