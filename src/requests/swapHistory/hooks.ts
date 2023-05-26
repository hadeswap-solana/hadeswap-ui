import { NftActivityData } from '../../state/core/types';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchSwapHistoryCollection, fetchSwapHistoryPool } from './requsts';
import { ActivityPeriod } from '../../components/Chart/components';

export const useSwapHistoryDataPool = (
  currentPeriod: ActivityPeriod,
): {
  swapHistoryDataPool: NftActivityData[];
  swapHistoryLoadingPool: boolean;
} => {
  const { poolPubkey: publicKey } = useParams<{ poolPubkey: string }>();

  const { data, isLoading } = useQuery(
    ['swapHistory', publicKey, currentPeriod],
    () => fetchSwapHistoryPool(publicKey, currentPeriod),
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

export const useSwapHistoryDataCollection = (
  currentPeriod: ActivityPeriod,
): {
  swapHistoryCollection: any[];
  swapHistoryLoadingCollection: boolean;
} => {
  const { publicKey: marketPublicKey } = useParams<{ publicKey: string }>();

  const { data, isLoading } = useQuery(
    ['swapHistory', marketPublicKey, currentPeriod],
    () => fetchSwapHistoryCollection(marketPublicKey, currentPeriod),
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
