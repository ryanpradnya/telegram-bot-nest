import { HttpStatus } from '@nestjs/common';

export class CustomError extends Error {
  status: HttpStatus;
  constructor(status: HttpStatus, message: string) {
    super();
    this.message = message;
    this.status = status;
  }
}
