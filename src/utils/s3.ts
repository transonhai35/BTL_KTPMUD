import {S3Client} from '@aws-sdk/client-s3';
import {s3Config} from '../config';

export const s3Client = new S3Client({
  endpoint: s3Config.endpoint,
  credentials: {
    accessKeyId: s3Config.accessKeyId,
    secretAccessKey: s3Config.secretAccessKey,
  },
  forcePathStyle: true,
  region: 'us-east-1',
});
