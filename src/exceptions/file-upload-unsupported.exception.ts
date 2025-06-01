/*
https://docs.nestjs.com/exception-filters#custom-exceptions
*/

import {HttpException, HttpStatus} from '@nestjs/common';

export class FileUploadUnsupportedException extends HttpException {
  constructor(type: string) {
    super(`Unsupport file: ${type}`, HttpStatus.BAD_REQUEST);
  }
}
