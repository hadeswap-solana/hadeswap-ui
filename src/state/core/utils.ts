export const setResponseDataAction = <TData>({
  data,
  isLoading,
}: {
  data: TData;
  isLoading: boolean;
}): {
  payload: {
    data: TData;
    isLoading: boolean;
  };
} => ({ payload: { data, isLoading } });
