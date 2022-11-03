import { useQuery, useQueries } from '@tanstack/react-query';
import { useWallet } from '@solana/wallet-adapter-react';
import { MarketInfo, Pair } from '../state/core/types';
import { web3 } from 'hadeswap-sdk';
import { fetchAllMarkets, fetchWalletPairs } from './requests';

interface AllMarketsQuery {
  queryKey: string[];
  queryFn: () => Promise<MarketInfo[]>;
  staleTime: number;
}

interface WalletPairsQuery {
  queryKey: string[];
  queryFn: () => Promise<Pair[]>;
  staleTime: number;
  enabled: boolean;
}

const allMarketsQuery: AllMarketsQuery = {
  queryKey: ['fetchAllMarkets'],
  queryFn: fetchAllMarkets,
  staleTime: 5 * 60 * 1000,
};

export const useFetchAllMarkets = () => {
  const { data, isLoading }: { data: MarketInfo[]; isLoading: boolean } =
    useQuery(allMarketsQuery);

  return { data, isLoading };
};

export const useFetchAllMarketsAndPairs = () => {
  const { publicKey }: { publicKey: web3.PublicKey } = useWallet();

  const walletPairsQuery: WalletPairsQuery = {
    queryKey: ['fetchWalletPairs', `${publicKey}`],
    queryFn: () => fetchWalletPairs(publicKey),
    staleTime: 5000,
    enabled: !!publicKey,
  };

  const response = useQueries({
    queries: [allMarketsQuery, walletPairsQuery],
  });

  const markets: MarketInfo[] = response[0].data;
  const pairs: Pair[] = response[1].data;
  const isLoading: boolean = response.some((item) => item.isLoading);
  return { markets, pairs, isLoading };
};
