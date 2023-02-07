export class QueryRequestDTO<T> {
  page: number;
  size: number;
  sort: Record<string, string>;
  filter: Partial<T>;

  constructor(partial: Partial<QueryRequestDTO<T>>) {
    Object.assign(this, partial);
  }
}

export class QueryTransformDTO {
  expose: string[];
  exclude: string[];

  constructor(data: QueryTransformDTO) {
    Object.assign(this, data);
  }
}
