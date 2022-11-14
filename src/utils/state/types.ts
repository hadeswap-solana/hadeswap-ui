export interface ServerError {
  code: number;
  message: string;
}

export interface AsyncState<TData> {
  data: TData | null;
  isLoading: boolean;
}
