import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CustomError } from '../errors/custom.error';
import { ValidationError } from '../errors/validation.error';

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        switch (true) {
          case err instanceof ValidationError:
            return throwError(new HttpException(err.message, err.code));
          case err instanceof CustomError:
            return throwError(new HttpException(err.message, err.status));
          case err instanceof BadRequestException:
            return throwError(new HttpException(err.response, err.status));
          case err instanceof UnauthorizedException:
            return throwError(new HttpException(err.response, err.status));
          default:
            const statusCode = err.status
              ? err.status
              : HttpStatus.INTERNAL_SERVER_ERROR;
            return throwError(new HttpException(err.message, statusCode));
        }
      }),
    );
  }
}
