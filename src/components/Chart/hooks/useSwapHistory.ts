import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import {
  useSwapHistoryDataCollection,
  useSwapHistoryDataPool,
} from '../../../requests';
import { Point } from '../types';

type UseSwapHistory = (market?: boolean) => {
  chartDataActivity: Point[] | null;
  swapHistoryLoading: boolean;
  currentPeriod: string;
  setCurrentPeriod: Dispatch<SetStateAction<string>>;
};

const useSwapHistory: UseSwapHistory = (market = false) => {
  const [currentPeriod, setCurrentPeriod] = useState<string>('day');
  const { swapHistoryDataPool, swapHistoryLoadingPool } =
    useSwapHistoryDataPool();
  const { swapHistoryCollection, swapHistoryLoadingCollection } =
    useSwapHistoryDataCollection();

  const swapHistory = !market ? swapHistoryDataPool : swapHistoryCollection;

  const sortedData = useMemo(() => {
    const millisecondInPeriod = {
      day: 86400000,
      week: 604800000,
    };

    if (currentPeriod === 'day') {
      const res = swapHistory?.filter((nftActivityData) => {
        const timestamp = Date.parse(nftActivityData.timestamp);
        const dateNow = Date.now();
        const calc = dateNow - timestamp;

        if (calc <= millisecondInPeriod.day) return nftActivityData;
      });
      return res;
    }

    if (currentPeriod === 'week') {
      const res = swapHistory?.filter((nftActivityData) => {
        const timestamp = Date.parse(nftActivityData.timestamp);
        const dateNow = Date.now();
        const calc = dateNow - timestamp;

        if (calc <= millisecondInPeriod.week) return nftActivityData;
      });
      return res;
    }

    return swapHistory;
  }, [currentPeriod, swapHistory]);

  const chartDataActivity = sortedData.map(
    ({ solAmount, orderType, timestamp }): Point => ({
      price: solAmount,
      type: orderType,
      order: Date.parse(timestamp),
    }),
  );

  return {
    chartDataActivity,
    swapHistoryLoading: swapHistoryLoadingPool || swapHistoryLoadingCollection,
    currentPeriod,
    setCurrentPeriod,
  };
};

export default useSwapHistory;
