import { MarketInfo, Pair } from '../state/core/types';
import { web3 } from 'hadeswap-sdk';

interface AllMarketsQuery {
  queryKey: string[];
  queryFn: () => Promise<MarketInfo[]>;
  staleTime: number;
}

type WalletPairsQuery = (walletPubkey: web3.PublicKey) => {
  queryKey: string[];
  queryFn: () => Promise<Pair[]>;
  staleTime: number;
};

export interface Query {
  fetchAllMarkets: AllMarketsQuery;
  fetchWalletPairs: WalletPairsQuery;
}
