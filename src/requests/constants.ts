import { Query } from './types';
import { fetchAllMarkets, fetchWalletPairs } from './requests';

export const query: Query = {
  fetchAllMarkets: {
    queryKey: ['fetchAllMarkets'],
    queryFn: fetchAllMarkets,
    staleTime: 5 * 60 * 1000,
  },
  fetchWalletPairs: (walletPubkey) => ({
    queryKey: ['fetchWalletPairs', `${walletPubkey}`],
    queryFn: fetchWalletPairs(walletPubkey),
    staleTime: 5,
  }),
};
