import { Dispatch, SetStateAction, useState } from 'react';
import { useSwapHistoryData } from '../../../requests';
import { Point } from '../types';

type UseSwapHistory = () => {
  chartDataActivity: Point[] | null;
  swapHistoryLoading: boolean;
  currentPeriod: string;
  setCurrentPeriod: Dispatch<SetStateAction<string>>;
};

const useSwapHistory: UseSwapHistory = () => {
  const [currentPeriod, setCurrentPeriod] = useState<string>('day');
  const { swapHistory, swapHistoryLoading } = useSwapHistoryData(currentPeriod);

  const chartDataActivity = swapHistory.map(
    ({ solAmount, orderType, timestamp }): Point => ({
      price: solAmount,
      type: orderType,
      order: Date.parse(timestamp),
    }),
  );

  return {
    chartDataActivity,
    swapHistoryLoading,
    currentPeriod,
    setCurrentPeriod,
  };
};

export default useSwapHistory;
