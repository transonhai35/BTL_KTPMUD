/*
https://docs.nestjs.com/modules
*/

import { s3Config } from '@/config';
import { slugify } from '@/utils/slugify';
import { Global, Logger, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import dayjs from 'dayjs';
import multerS3 from 'multer-s3';
import multer from 'multer';
import { basename, extname } from 'path';
import { s3Client } from '@/utils/s3';
import { UploadController } from './controllers/upload.controller';
import { UploadService } from './services/upload.service';
import  ExifTransformer  from 'exif-be-gone';

const useSharpValidator = true;
function getStorage() {
    if (useSharpValidator) {
      return multer.memoryStorage();
    }
    return multerS3({
        s3: s3Client,
        bucket: s3Config.bucket,
        acl: 'public-read',
        // contentType:multerS3.AUTO_CONTENT_TYPE,
        contentType:(req, file, cb) => {
          multerS3.AUTO_CONTENT_TYPE(req, file, function(_, mime, outputStream) {
            cb(null, file.mimetype || mime, outputStream.pipe(new ExifTransformer({readableObjectMode: true, writableObjectMode: true})));
          });
        },
        key: function (req, file, cb) {
          const fileExt = extname(file.originalname);
          const fileName = slugify(basename(file.originalname, fileExt));
          cb(null, `${dayjs().format('YYYY/MM/DD')}/${Date.now()}-${fileName}${fileExt}`);
        },
    });
}

@Global()
@Module({
  imports: [
    MulterModule.register({
      storage: getStorage(),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
