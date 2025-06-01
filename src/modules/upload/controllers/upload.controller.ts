/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ApiOkResponse, UseGuardAuth } from '@/decorators';
import { FileDto } from '@/common/dto/file.dto';
import { StorageTypeEnum } from '@/common/enums';
import { UploadService } from '../services/upload.service';

@ApiTags('Upload')
@UseGuardAuth()
@Controller('/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * Uploads a file.
   * This endpoint accepts a multipart/form-data request containing a file in the "file" field,
   * processes the file with an interceptor, stores file metadata using the UploadService,
   * and returns file details along with a generated URL.
   */
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post()
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }),
  ) // limit 5 MB
  @ApiOkResponse({
    type: FileDto,
  })
  async upload(@UploadedFile() file: Express.Multer.File): Promise<FileDto> {
    const { fieldname, originalname, mimetype, size, buffer } = file;
    const { bucket, key, url, acl } =
      await this.uploadService.saveBufferToS3(file);

    return {
      storage: StorageTypeEnum.S3,
      fieldname,
      originalname,
      mimetype,
      size,
      bucket,
      key,
      url,
    };
  }
}
