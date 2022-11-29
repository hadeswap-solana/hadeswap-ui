import { useQuery } from '@tanstack/react-query';
import { fetchAllStats, fetchVolume24 } from './requests';

const createData = ({
  TVL = null,
  volume = null,
  volume24 = null,
}: {
  TVL?: string;
  volume?: string;
  volume24?: string;
}) => {
  return {
    '24h volume': volume24,
    'all time volume': volume,
    'total value locked': TVL,
  };
};

export const useStats = (): {
  data: ReturnType<typeof createData>;
  isLoading: boolean;
} => {
  const { data, isLoading, isFetching } = useQuery(
    ['stats'],
    async () => {
      const [allStats, volume24] = await Promise.all([
        fetchAllStats(),
        fetchVolume24(),
      ]);
      return createData({
        volume24,
        volume: allStats.volume,
        TVL: allStats.TVL,
      });
    },
    {
      networkMode: 'offlineFirst',
      initialData: createData({}),
    },
  );

  return {
    data,
    isLoading: isLoading || isFetching,
  };
};
