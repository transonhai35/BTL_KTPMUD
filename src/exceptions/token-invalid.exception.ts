/*
https://docs.nestjs.com/exception-filters#custom-exceptions
*/

import {HttpException, HttpStatus} from '@nestjs/common';

export class TokenInvalidException extends HttpException {
  constructor() {
    super('token.invalid', HttpStatus.BAD_REQUEST);
  }
}
