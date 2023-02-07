import { HttpStatus } from '@nestjs/common';

export class ValidationError extends Error {
  code: HttpStatus;
  constructor(message: string, code: HttpStatus) {
    super();
    this.message = message;
    this.code = code;
  }
}
