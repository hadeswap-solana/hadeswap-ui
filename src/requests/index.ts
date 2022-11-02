import { useQuery, useQueries } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { query } from './constants';
import { MarketInfo, Pair } from '../state/core/types';
import { selectWalletPublicKey } from '../state/common/selectors';
import { web3 } from 'hadeswap-sdk';

export const useFetchAllMarkets = () => {
  const { data, isLoading }: { data: MarketInfo[]; isLoading: boolean } =
    useQuery(query.fetchAllMarkets);
  return { data, isLoading };
};

export const useFetchAllMarketsAndPairs = () => {
  const walletPubkey: web3.PublicKey = useSelector(selectWalletPublicKey);
  const response = useQueries({
    queries: [
      query.fetchAllMarkets,
      {
        ...query.fetchWalletPairs(walletPubkey),
        enabled: !!walletPubkey,
      },
    ],
  });

  const data: (MarketInfo[] | Pair[])[] = response.map((item) => item.data);
  const isLoading: boolean = response.some((item) => item.isLoading);
  return { data, isLoading };
};
