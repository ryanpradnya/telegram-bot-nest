import { Injectable } from '@nestjs/common';
import { OperatorFunction } from 'rxjs';
import { map, reduce, scan } from 'rxjs/operators';
import {
  CustomResponseDTO,
  MultiDocument,
} from '../../delivery/dto/default.dto';

@Injectable()
export class DefaultService {
  public combine$<T>(): OperatorFunction<T, T[]> {
    return (input$) =>
      input$.pipe(
        scan((acc, value) => {
          if (value !== null) {
            acc.push(value);
          }
          return acc;
        }, new Array<T>()),
      );
  }

  public join$<T>(): OperatorFunction<T, T[]> {
    return (input$) =>
      input$.pipe(
        reduce((acc, value) => {
          if (value !== null && value !== undefined) {
            acc.push(value);
          }
          return acc;
        }, new Array<T>()),
      );
  }

  public transformMultiDocument$<T>(): OperatorFunction<
    MultiDocument<T>,
    CustomResponseDTO
  > {
    return (input$) =>
      input$.pipe(
        map((val) => {
          const { data, total } = val;
          return {
            data,
            headers: {
              'x-total-count': total.toString(),
            },
          };
        }),
      );
  }
}
