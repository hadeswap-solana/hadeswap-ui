import { useQuery, useQueries } from '@tanstack/react-query';
import { useWallet } from '@solana/wallet-adapter-react';
import { MarketInfo, Pair, Nft } from '../state/core/types';
import { web3 } from 'hadeswap-sdk';
import {
  fetchAllMarkets,
  fetchWalletPairs,
  fetchPair,
  fetchMarketPairs,
  fetchMarket,
  fetchMarketWalletNfts,
} from './requests';
import {
  AllMarketsQuery,
  PairsQuery,
  PairQuery,
  MarketQuery,
  MarketWalletNftsQuery,
} from './types';
import { combineFetchingStatusResponse } from './utils';

const BASE_STALE_TIME = 5 * 60 * 1000; // 5 min
const SHORT_STALE_TIME = 10000; // 10 sec

const allMarketsQuery: AllMarketsQuery = {
  queryKey: ['fetchAllMarkets'],
  queryFn: fetchAllMarkets,
  staleTime: BASE_STALE_TIME,
};

export const useFetchMarketWalletNfts = (
  marketPubkey: string,
): {
  data: Nft[];
  isLoading: boolean;
  isFetching: boolean;
} => {
  const { publicKey }: { publicKey: web3.PublicKey } = useWallet();

  const marketWalletNftsQuery: MarketWalletNftsQuery = {
    queryKey: ['fetchMarketWalletNfts', `${marketPubkey}`, `${publicKey}`],
    queryFn: () =>
      fetchMarketWalletNfts({
        marketPubkey,
        walletPubkey: publicKey.toBase58(),
      }),
    staleTime: SHORT_STALE_TIME,
    enabled: !!publicKey && !!marketPubkey,
  };

  const {
    data = [],
    isLoading,
    isFetching,
  }: {
    data: Nft[];
    isLoading: boolean;
    isFetching: boolean;
  } = useQuery(marketWalletNftsQuery);

  return { data, isLoading, isFetching };
};

export const useFetchMarket = (
  marketPubkey: string,
): {
  data: MarketInfo;
  isLoading: boolean;
  isFetching: boolean;
} => {
  const marketQuery: MarketQuery = {
    queryKey: ['fetchMarket', `${marketPubkey}`],
    queryFn: () => fetchMarket(marketPubkey),
    staleTime: BASE_STALE_TIME,
    enabled: !!marketPubkey,
  };

  const {
    data = null,
    isLoading,
    isFetching,
  }: {
    data: MarketInfo;
    isLoading: boolean;
    isFetching: boolean;
  } = useQuery(marketQuery);

  return { data, isLoading, isFetching };
};

export const useFetchPair = (
  poolPubKey: string,
): {
  data: Pair;
  isLoading: boolean;
  isFetching: boolean;
} => {
  const pairQuery: PairQuery = {
    queryKey: ['fetchPair', `${poolPubKey}`],
    queryFn: () => fetchPair(poolPubKey),
    staleTime: BASE_STALE_TIME,
    enabled: !!poolPubKey,
  };

  const {
    data = null,
    isLoading,
    isFetching,
  }: {
    data: Pair;
    isLoading: boolean;
    isFetching: boolean;
  } = useQuery(pairQuery);

  return { data, isLoading, isFetching };
};

export const useFetchMarketPairs = (
  marketPubKey: string,
): {
  data: Pair[];
  isLoading: boolean;
  isFetching: boolean;
} => {
  const marketPairsQuery: PairsQuery = {
    queryKey: ['fetchMarketPairs', `${marketPubKey}`],
    queryFn: () => fetchMarketPairs(marketPubKey),
    staleTime: SHORT_STALE_TIME,
    enabled: !!marketPubKey,
  };

  const {
    data = [],
    isLoading,
    isFetching,
  }: {
    data: Pair[];
    isLoading: boolean;
    isFetching: boolean;
  } = useQuery(marketPairsQuery);

  return { data, isLoading, isFetching };
};

export const useFetchAllMarkets = (): {
  data: MarketInfo[];
  isLoading: boolean;
  isFetching: boolean;
} => {
  const {
    data = [],
    isLoading,
    isFetching,
  }: {
    data: MarketInfo[];
    isLoading: boolean;
    isFetching: boolean;
  } = useQuery(allMarketsQuery);

  return { data, isLoading, isFetching };
};

export const useFetchAllMarketsAndPairs = (): {
  markets: MarketInfo[];
  pairs: Pair[];
  isLoading: boolean;
  isFetching: boolean;
} => {
  const { publicKey }: { publicKey: web3.PublicKey } = useWallet();

  const walletPairsQuery: PairsQuery = {
    queryKey: ['fetchWalletPairs', `${publicKey}`],
    queryFn: () => fetchWalletPairs(publicKey),
    staleTime: 10,
    enabled: !!publicKey,
  };

  const response = useQueries({
    queries: [allMarketsQuery, walletPairsQuery],
  });

  const markets: MarketInfo[] = response[0].data;
  const pairs: Pair[] = response[1].data;
  const { isLoading, isFetching }: { isLoading: boolean; isFetching: boolean } =
    combineFetchingStatusResponse(response);

  return { markets, pairs, isLoading, isFetching };
};
