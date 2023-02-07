export interface CallbackButton {
  label: string;
  value: string;
  action?: string;
  dinamic?: boolean;
  main?: boolean;
  page?: number;
  number?: number;
}

export interface CallbackButtonOption {
  row?: number;
  dinamic?: boolean;
  numbering?: boolean;
  setLabel?: (label: string) => string;
}
