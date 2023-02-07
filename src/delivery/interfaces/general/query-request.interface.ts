import { ClassConstructor } from 'class-transformer';

export class QueryRequest {
  page: number;
  size: number;
  sort: any;
  exclude: any;
  expose: any;
  filter: QueryFilter[];

  constructor(partial: Partial<QueryRequest>) {
    Object.assign(this, partial);
  }
}

export class QueryTransform {
  expose: string[];
  exclude: string[];

  constructor(data: QueryTransform) {
    Object.assign(this, data);
  }
}

export interface QueryFilter {
  key: string;
  filter: string;
  value: string | string[];
}

export interface QueryOption {
  defaultExclude?: string[];
  defaultExpose?: string[];
}

export interface QueryData<T> {
  classConstructor: ClassConstructor<T>;
  option?: QueryOption;
}
