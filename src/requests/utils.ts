import { FETCHING } from '../constants/common';

export const combineFetchingStatus = ({
  loadingA,
  loadingB,
  fetchingA,
  fetchingB,
}: {
  loadingA: boolean;
  loadingB: boolean;
  fetchingA: boolean;
  fetchingB: boolean;
}): {
  isLoading: boolean;
  isFetching: boolean;
} => {
  return {
    isLoading: loadingA || loadingB,
    isFetching: fetchingA || fetchingB,
  };
};

export const combineFetchingStatusResponse = (
  response: any[],
): {
  isLoading: boolean;
  isFetching: boolean;
} => {
  const isLoading: boolean = response.some((item) => item.isLoading);
  const isFetching: boolean = response.some(
    (item) => item.fetchStatus === FETCHING,
  );
  return { isLoading, isFetching };
};
