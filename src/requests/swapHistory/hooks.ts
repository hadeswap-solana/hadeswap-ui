import { NftActivityData } from '../../state/core/types';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchSwapHistoryCollection, fetchSwapHistoryPool } from './requsts';

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

  const { data, isLoading } = useQuery(
    ['swapHistory', `${marketPublicKey}`],
    () => fetchSwapHistoryCollection(marketPublicKey),
    {
      networkMode: 'offlineFirst',
      refetchOnWindowFocus: false,
    },
  );

  return {
    swapHistoryCollection: data || [],
    swapHistoryLoadingCollection: isLoading,
  };
};
