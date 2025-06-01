/*
https://docs.nestjs.com/exception-filters#custom-exceptions
*/

import {HttpException, HttpStatus} from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor() {
    super('User not found', HttpStatus.BAD_REQUEST);
  }
}
