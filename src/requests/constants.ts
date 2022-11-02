import { web3 } from 'hadeswap-sdk';
import { fetchAllMarkets, fetchWalletPairs } from './requests';
import { QueryProps } from './index';

export type FetchWalletPairs = (walletPubkey: web3.PublicKey) => {
  queryKey: string[];
  queryFn: () => Promise<void>;
  cacheTime: number;
};

interface IQuery {
  fetchAllMarkets: QueryProps;
  fetchWalletPairs: FetchWalletPairs;
}

export const query: IQuery = {
  fetchAllMarkets: {
    queryKey: ['fetchAllMarkets'],
    queryFn: fetchAllMarkets,
    cacheTime: 5 * 60 * 1000,
  },
  fetchWalletPairs: (walletPubkey) => ({
    queryKey: ['fetchWalletPairs', `${walletPubkey}`],
    queryFn: fetchWalletPairs(walletPubkey),
    cacheTime: 5,
  }),
};
