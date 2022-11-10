import { MarketInfo, Nft, Pair } from '../state/core/types';

export interface AllMarketsQuery {
  queryKey: string[];
  queryFn: () => Promise<MarketInfo[]>;
  staleTime: number;
}

export interface PairsQuery {
  queryKey: string[];
  queryFn: () => Promise<Pair[]>;
  staleTime: number;
  enabled: boolean;
}

export interface PairQuery {
  queryKey: string[];
  queryFn: () => Promise<Pair>;
  staleTime: number;
  enabled: boolean;
}

export interface MarketQuery {
  queryKey: string[];
  queryFn: () => Promise<MarketInfo>;
  staleTime: number;
  enabled: boolean;
}

export interface MarketWalletNftsQuery {
  queryKey: string[];
  queryFn: () => Promise<Nft[]>;
  staleTime: number;
  enabled: boolean;
}
