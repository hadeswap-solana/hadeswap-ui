import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { NftActivityData } from '../../state/core/types';
import { useState } from 'react';

export const useTableData = (params: {
  publicKey: string;
  url: string;
  id: string;
}): {
  data: InfiniteData<{ pageParam: number; data: NftActivityData[] }>;
  fetchNextPage: (options?: FetchNextPageOptions) => Promise<
    InfiniteQueryObserverResult<{
      pageParam: number;
      data: NftActivityData[];
    }>
  >;
  isFetchingNextPage: boolean;
  isListEnded: boolean;
} => {
  const LIMIT = 10;

  const { publicKey, url: baseUrl, id } = params;

  const [isListEnded, setIsListEnded] = useState<boolean>(false);

  const fetchData = async ({
    pageParam,
    publicKey,
  }: {
    pageParam: number;
    publicKey: string;
  }) => {
    const data: NftActivityData[] = await (
      await fetch(
        `${baseUrl}/${publicKey}?sortBy=timestamp&sort=desc&limit=${LIMIT}&skip=${
          LIMIT * pageParam
        }`,
      )
    ).json();

    if (!data?.length) {
      setIsListEnded(true);
    }

    return {
      pageParam,
      data,
    };
  };

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    [id, publicKey],
    ({ pageParam = 0 }) => fetchData({ pageParam, publicKey }),
    {
      enabled: !!publicKey,
      getPreviousPageParam: (firstPage) => {
        return firstPage.pageParam - 1 ?? undefined;
      },
      getNextPageParam: (lastPage) => {
        return lastPage.data?.length ? lastPage.pageParam + 1 : undefined;
      },
      cacheTime: 100_000,
      networkMode: 'offlineFirst',
      refetchOnWindowFocus: false,
    },
  );

  return {
    data,
    fetchNextPage,
    isFetchingNextPage,
    isListEnded,
  };
};
