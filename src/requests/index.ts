import { useEffect, useState } from 'react';
import {
  useInfiniteQuery,
  useQuery,
  InfiniteData,
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
  QueryStatus,
  FetchStatus,
} from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { web3 } from 'hadeswap-sdk';
import {
  fetchAllMarkets,
  fetchWalletPairs,
  fetchPair,
  fetchMarketPairs,
  fetchMarket,
  fetchMarketWalletNfts,
  fetchSwapHistoryPool,
  fetchSwapHistoryCollection,
} from './requests';
import { LoadingStatus, FetchingStatus } from './types';
import { MarketInfo, Pair, Nft, NftActivityData } from '../state/core/types';
import { coreActions } from '../state/core/actions';

const BASE_STALE_TIME = 5 * 60 * 1000; // 5 min
const SHORT_STALE_TIME = 10000; // 10 sec

export const useFetchMarketWalletNfts = (
  marketPubkey: string,
): {
  walletNfts: Nft[];
  nftsLoading: boolean;
} => {
  const dispatch = useDispatch();
  const { publicKey }: { publicKey: web3.PublicKey } = useWallet();
  const walletPubkey: string = publicKey?.toBase58();

  const {
    data,
    isLoading,
    isFetching,
  }: {
    data: Nft[];
    isLoading: boolean;
    isFetching: boolean;
  } = useQuery(
    ['fetchMarketWalletNfts', `${marketPubkey}`, `${walletPubkey}`],
    () =>
      fetchMarketWalletNfts({
        walletPubkey,
        marketPubkey,
      }),
    {
      staleTime: SHORT_STALE_TIME,
      enabled: !!walletPubkey && !!marketPubkey,
      refetchOnWindowFocus: false,
    },
  );

  const nftsLoading = isLoading || isFetching;

  useEffect(() => {
    dispatch(coreActions.setMarketWalletNfts({ data, isLoading: nftsLoading }));
  }, [data, nftsLoading, dispatch]);

  return {
    walletNfts: data,
    nftsLoading,
  };
};

export const useFetchMarket = (publicKey: string): void => {
  const dispatch = useDispatch();

  const {
    data,
    isLoading,
    isFetching,
  }: {
    data: MarketInfo;
    isLoading: boolean;
    isFetching: boolean;
  } = useQuery(['fetchMarket', `${publicKey}`], () => fetchMarket(publicKey), {
    staleTime: BASE_STALE_TIME,
    enabled: !!publicKey,
    refetchOnWindowFocus: false,
  });

  const marketLoading = isLoading || isFetching;

  useEffect(() => {
    dispatch(coreActions.setMarket({ data, isLoading: marketLoading }));
  }, [dispatch, data, marketLoading]);
};

type UseFetchPair = () => { refetch: () => void };

export const useFetchPair: UseFetchPair = () => {
  const dispatch = useDispatch();
  const { poolPubkey } = useParams<{ poolPubkey: string }>();

  const { data, isLoading, isFetching, refetch } = useQuery(
    ['fetchPair', `${poolPubkey}`],
    () => fetchPair(poolPubkey),
    {
      staleTime: BASE_STALE_TIME,
      enabled: !!poolPubkey,
      refetchOnWindowFocus: false,
    },
  );

  const pairLoading = isLoading || isFetching;

  useEffect(() => {
    dispatch(coreActions.setPair({ data, isLoading: pairLoading }));
  }, [dispatch, pairLoading, data]);

  return {
    refetch,
  };
};

export const useFetchMarketPairs = (): void => {
  const dispatch = useDispatch();
  const { publicKey: marketPubkey } = useParams<{ publicKey: string }>();

  const {
    data,
    isLoading,
    isFetching,
  }: {
    data: Pair[];
    isLoading: boolean;
    isFetching: boolean;
  } = useQuery(
    ['fetchMarketPairs', `${marketPubkey}`],
    () => fetchMarketPairs(marketPubkey),
    {
      staleTime: SHORT_STALE_TIME,
      enabled: !!marketPubkey,
      refetchOnWindowFocus: false,
    },
  );

  const pairsLoading = isLoading || isFetching;

  useEffect(() => {
    dispatch(coreActions.setMarketPairs({ data, isLoading: pairsLoading }));
  }, [data, pairsLoading, dispatch]);
};

export const useFetchAllMarkets = (): void => {
  const dispatch = useDispatch();

  const {
    data,
    status,
    fetchStatus,
  }: {
    data: MarketInfo[];
    status: QueryStatus;
    fetchStatus: FetchStatus;
  } = useQuery(['fetchAllMarkets'], fetchAllMarkets, {
    staleTime: BASE_STALE_TIME,
    refetchOnWindowFocus: false,
  });

  const marketsLoading =
    status === LoadingStatus.loading || fetchStatus === FetchingStatus.fetching;

  useEffect(() => {
    dispatch(coreActions.setAllMarkets({ data, isLoading: marketsLoading }));
  }, [dispatch, data, marketsLoading]);
};

export const useFetchWalletPairs = (): void => {
  const dispatch = useDispatch();
  const { publicKey }: { publicKey: web3.PublicKey } = useWallet();

  const {
    data,
    status,
    fetchStatus,
  }: {
    data: Pair[];
    status: QueryStatus;
    fetchStatus: FetchStatus;
  } = useQuery(
    ['fetchWalletPairs', `${publicKey}`],
    () => fetchWalletPairs(publicKey),
    {
      staleTime: 10,
      enabled: !!publicKey,
      refetchOnWindowFocus: false,
    },
  );

  const walletPairsLoading =
    status === LoadingStatus.loading || fetchStatus === FetchingStatus.fetching;

  useEffect(() => {
    dispatch(
      coreActions.setWalletPairs({ data, isLoading: walletPairsLoading }),
    );
  }, [dispatch, data, walletPairsLoading]);
};

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

export const useSwapHistoryDataPool = (): {
  swapHistoryDataPool: NftActivityData[];
  swapHistoryLoadingPool: boolean;
} => {
  const { poolPubkey: publicKey } = useParams<{ poolPubkey: string }>();

  const { data, isLoading } = useQuery(
    ['swapHistory', `${publicKey}`],
    () => fetchSwapHistoryPool(publicKey),
    {
      networkMode: 'offlineFirst',
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  );

  return {
    swapHistoryDataPool: data || [],
    swapHistoryLoadingPool: isLoading,
  };
};

export const useSwapHistoryDataCollection = (): {
  swapHistoryCollection: NftActivityData[];
  swapHistoryLoadingCollection: boolean;
} => {
  const { publicKey: marketPublicKey } = useParams<{ publicKey: string }>();

  const { data, isLoading } = useInfiniteQuery(
    ['swapHistory', `${marketPublicKey}`],
    () => fetchSwapHistoryCollection(marketPublicKey),
    {
      networkMode: 'offlineFirst',
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  );

  const activityData = data?.pages?.flat();

  return {
    swapHistoryCollection: activityData || [],
    swapHistoryLoadingCollection: isLoading,
  };
};
