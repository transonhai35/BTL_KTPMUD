/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, Logger } from '@nestjs/common';
import { s3Client } from '@/utils/s3';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import dayjs from 'dayjs';
import { randString } from '@/utils/random';
import mime from 'mime-types';
import { s3Config } from '@/config';
import axios, { AxiosInstance } from 'axios';
import { getFileUrl } from '@/utils/url';

function getExt(url) {
  return (url = url.substr(1 + url.lastIndexOf('/')).split('?')[0])
    .split('#')[0]
    .substr(url.lastIndexOf('.'));
}

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  private readonly s3: S3Client = s3Client;

  private readonly http: AxiosInstance;

  constructor() {
    this.http = axios.create();
  }

  async saveImageUrlToS3(
    input: string,
    key?: string,
  ): Promise<{ bucket?: string; key?: string; url: string }> {
    if (input.startsWith(s3Config.publicUrl)) {
      return {
        url: input,
      };
    }
    const ext = getExt(input);
    const objectKey = key
      ? key
      : `${dayjs().format('YYYY/MM/DD')}/${randString(32)}${ext}`;
    const fileStream = await this.http.get(input, {
      responseType: 'stream',
    });
    const contentType = mime.lookup(ext) || fileStream.headers['content-type'];

    const params = new PutObjectCommand({
      Bucket: s3Config.bucket,
      Key: objectKey,
      ACL: 'public-read',
      Body: fileStream.data,
      ContentType: contentType,
    });
    await this.s3.send(params);
    // const url = `${s3Config.publicUrl}/${objectKey}`;
    this.logger.log('saveImageUrlToS3 objectKey = ' + objectKey);
    return {
      bucket: s3Config.bucket,
      key: objectKey,
      url: getFileUrl(objectKey),
    };
  }

  async saveBufferToS3(file: Express.Multer.File, key?: string) {
    const objectKey = key
      ? key
      : `${dayjs().format('YYYY/MM/DD')}/${Date.now()}-${file.originalname}`;
    const params = new PutObjectCommand({
      Bucket: s3Config.bucket,
      Key: objectKey,
      ACL: 'public-read',
      Body: file.buffer,
      ContentType: file.mimetype,
    });
    await this.s3.send(params);
    this.logger.log('saveBufferToS3  objectKey = ' + objectKey);
    return {
      acl: 'public-read',
      bucket: s3Config.bucket,
      key: objectKey,
      url: getFileUrl(objectKey),
    };
  }
}
