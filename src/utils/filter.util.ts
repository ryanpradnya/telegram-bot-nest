import { FilterCriteria } from '../delivery/enum/filter.enum';
import { QueryFilter } from '../delivery/interfaces/general/query-request.interface';

export function filterData<T>(queries: QueryFilter[], data: T) {
  for (const query of queries) {
    const { key, value, filter } = query;
    const result = valueOf(data, key);

    if (result !== undefined && result !== null) {
      switch (filter) {
        case FilterCriteria.notEqual:
          if (result !== value) {
            break;
          } else {
            return undefined;
          }

        case FilterCriteria.greatherThanOrEqual:
          if (result >= value) {
            break;
          } else {
            return undefined;
          }

        case FilterCriteria.lessThanOrEqual:
          if (result <= value) {
            break;
          } else {
            return undefined;
          }

        case FilterCriteria.greatherThan:
          if (result > value) {
            break;
          } else {
            return undefined;
          }

        case FilterCriteria.lessThan:
          if (result < value) {
            break;
          } else {
            return undefined;
          }

        case FilterCriteria.includes:
          if (
            (typeof result === 'string' || Array.isArray(result)) &&
            result.includes(value.toString())
          ) {
            break;
          } else {
            return undefined;
          }

        case FilterCriteria.in:
          if (typeof value === 'string' && value.split(',').includes(result)) {
            break;
          } else {
            return undefined;
          }

        case FilterCriteria.contains:
          if (
            typeof value === 'string' &&
            result.toLowerCase().includes(value.toLowerCase())
          ) {
            break;
          } else {
            return undefined;
          }

        default:
          if (result === value) {
            break;
          } else {
            return undefined;
          }
      }
    } else {
      return undefined;
    }
  }

  return data;
}

export function valueOf(data: any, key: string): any {
  return key.split('.').reduce((prev, curr) => {
    return prev !== undefined &&
      prev !== null &&
      curr !== undefined &&
      curr !== null &&
      prev[curr] !== undefined &&
      prev[curr] !== null
      ? prev[curr]
      : undefined;
  }, data);
}

export function filterExposeExclude(
  data: any,
  classKeys: string[],
  defaultValue: string[] = [],
): string[] {
  const filterValue = defaultValue.filter((key) => classKeys.includes(key));
  let values: string[] = [];

  if (!data) {
    return filterValue;
  } else if (Array.isArray(data)) {
    values = data;
  } else {
    values.push(data);
  }

  return values.reduce((val, curr) => {
    if (curr.includes(',')) {
      return [
        ...val,
        ...curr.split(',').filter((key) => classKeys.includes(key)),
      ];
    } else if (classKeys.includes(curr)) {
      val.push(curr);
    }
    return val;
  }, filterValue);
}
