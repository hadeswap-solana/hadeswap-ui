import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import {
  useSwapHistoryDataCollection,
  useSwapHistoryDataPool,
} from '../../../requests';
import { OrderType } from '../../../state/core/types';
import { Point } from '../types';
import { ActivityPeriod } from '../components/constants';

type UseSwapHistory = ({ market }: { market?: boolean }) => {
  chartDataActivity: Point[] | null | any;
  swapHistoryLoading: boolean;
  currentPeriod: string;
  setCurrentPeriod: Dispatch<SetStateAction<string>>;
};

export const useSwapHistory: UseSwapHistory = ({ market = false }) => {
  const [currentPeriod, setCurrentPeriod] = useState<ActivityPeriod>(
    ActivityPeriod.day,
  );
  const { swapHistoryDataPool, swapHistoryLoadingPool } =
    useSwapHistoryDataPool(currentPeriod);
  const { swapHistoryCollection, swapHistoryLoadingCollection } =
    useSwapHistoryDataCollection(currentPeriod);

  const swapHistory = !market ? swapHistoryDataPool : swapHistoryCollection;

  const valueForPool = (orderType: OrderType) => {
    return orderType === OrderType.BUY ? OrderType.SELL : OrderType.BUY;
  };

  const chartDataActivity = swapHistory?.map(
    ({ price, type, order }): Point => ({
      price: price / 1e9,
      type: market ? type : valueForPool(type),
      order: order * 1000,
    }),
  );

  return {
    chartDataActivity: chartDataActivity,
    swapHistoryLoading: swapHistoryLoadingPool || swapHistoryLoadingCollection,
    currentPeriod,
    setCurrentPeriod,
  };
};

export default useSwapHistory;
