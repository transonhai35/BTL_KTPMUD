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
import { CommuneService } from '../services/commune.service';
import { CommuneDto, CreateCommuneDto, UpdateCommuneDto } from '../dto/commune.dto';


@ApiTags('commune')
@Controller('/communes')
@UseGuardAuth()
export class CommuneController {
  constructor(private readonly communeService: CommuneService) { }

  @Get('/communes')
  @ApiOkResponse({
    type: CommuneDto,
    isArray: true,
  })
  async getAllCommunes(): Promise<CommuneDto[]> {
    return this.communeService.findAll();
  }

  @Get('/:id')
  @ApiOkResponse({
    type: CommuneDto,
  })
  async getCommuneById(@Param('id') id: string): Promise<CommuneDto> {
    return this.communeService.findOne(id);
  }

  @Post('/')
  @ApiOkResponse({
    type: CommuneDto,
  })
  @UseGuardAuth({
    roles: [RoleTypeEnum.Admin]
  })
  async createCommune(@AuthUser('id') userId: string, @Body() payload: CreateCommuneDto): Promise<CommuneDto> {
    return this.communeService.create(payload, userId);
  }
  
  @Put('/:id')
  @ApiOkResponse({
    type: CommuneDto,
  })
  @UseGuardAuth({
    roles: [RoleTypeEnum.Admin]
  })
  async updateCommune(@Param('id') id: string, @Body() payload: UpdateCommuneDto): Promise<CommuneDto> {
    return this.communeService.update(id, payload);
  }

  @Delete('/:id')
  @ApiOkResponse({
    type: CommuneDto,
  })
  @UseGuardAuth({
    roles: [RoleTypeEnum.Admin]
  })
  async removeCommune(@Param('id') id: string): Promise<void> {
    return this.communeService.remove(id);
  }

}