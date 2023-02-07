import { ClassConstructor, plainToInstance } from 'class-transformer';
import { FilterCriteria } from '../delivery/enum/filter.enum';
import {
  QueryFilter,
  QueryTransform,
} from '../delivery/interfaces/general/query-request.interface';
import { valueOf } from './filter.util';
import { stringToObject } from './formatter.util';

export function transformAndSerialize<T>(
  cls: ClassConstructor<T>,
  classKeys: string[],
  data: any,
): QueryFilter[] {
  return Object.keys(data).reduce((val, curr) => {
    if (curr.includes('.')) {
      const filter: any = curr.match(/\b(\w+)$/).shift();
      const key = curr.replace(`.${filter}`, '');
      const parent = key.split('.')[0];

      if (
        classKeys.includes(parent) &&
        Object.values(FilterCriteria).includes(filter)
      ) {
        const transform = JSON.parse(
          JSON.stringify(
            plainToInstance(cls, stringToObject(key, data[curr]), {
              excludeExtraneousValues: true,
            }),
          ),
        );

        val.push({
          key,
          filter,
          value: valueOf(transform, key),
        });
      }
    }

    return val;
  }, new Array<QueryFilter>());
}

export function exposeAndExcludeTransform<T>(
  data: T,
  transform: QueryTransform,
): T {
  const { expose, exclude } = transform;

  return exclude.reduce((val, curr) => {
    if (!expose.find((value) => value === curr)) delete val[curr];
    return val;
  }, data);
}

export function arrayTransformAndAssignObject<T>(array: Array<T>, add: object) {
  for (const object of array) {
    for (const keys of Object.keys(add)) {
      object[keys] = add[keys];
    }
  }
  return array;
}
