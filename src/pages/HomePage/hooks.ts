import { useQuery } from '@tanstack/react-query';
import {
  fetchAllStats,
  fetchTVLandVolumeStats,
  fetchTopMarkets,
} from '../../requests/requests';
import { AllStats, TVLandVolumeStats, TopMarket } from '../../requests/types';

export const useFetchAllStats = (): {
  allStats: AllStats;
  allStatsLoading: boolean;
} => {
  const { data, isLoading, isFetching } = useQuery(
    ['allStats'],
    () => fetchAllStats(),
    {
      networkMode: 'offlineFirst',
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  );

  const initialData = {
    volume24h: null,
    volumeAll: null,
    solanaTPS: null,
    solanaPrice: null,
  };

  return {
    allStats: data || initialData,
    allStatsLoading: isLoading || isFetching,
  };
};

export const useFetchTVL = (): {
  TVLstat: string;
  TVLStatLoading: boolean;
} => {
  const {
    data,
    isLoading,
    isFetching,
  }: {
    data: TVLandVolumeStats;
    isLoading: boolean;
    isFetching: boolean;
  } = useQuery(['TVL'], () => fetchTVLandVolumeStats(), {
    networkMode: 'offlineFirst',
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  return {
    TVLstat: data?.TVL || '',
    TVLStatLoading: isLoading || isFetching,
  };
};

export const useTopMarkets = (): {
  topMarkets: TopMarket[];
  topMarketsLoading: boolean;
} => {
  const { data, isLoading, isFetching } = useQuery(
    ['topMarkets'],
    () => fetchTopMarkets(),
    {
      networkMode: 'offlineFirst',
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  );

  return {
    topMarkets: data || [],
    topMarketsLoading: isLoading || isFetching,
  };
};
