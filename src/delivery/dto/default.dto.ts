export interface CustomResponseDTO {
  data: any;
  headers: Record<string, string>;
}

export interface MultiDocument<T> {
  data: T[];
  total: number;
}
