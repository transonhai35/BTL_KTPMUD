import {StorageTypeEnum} from '../enums';

export class FileDto {
  storage: StorageTypeEnum;
  fieldname: string;
  originalname: string;
  mimetype: string;
  size: number;
  bucket: string;
  key: string;
  url: string;
  acl?: string;
  userId?: string;
}
