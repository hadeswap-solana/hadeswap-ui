import { FC } from 'react';
import { useSelector } from 'react-redux';
import { useFetchPair, useFetchMarket } from '../../requests';
import { AppLayout } from '../../components/Layout/AppLayout';
import PageContentLayout from '../../components/Layout/PageContentLayout';
import { PoolHeader } from './components/PoolHeader';
import { PoolGeneralInfo } from './components/PoolGeneralInfo';
import { NftList } from './components/NftList';
import { Spinner } from '../../components/Spinner/Spinner';
import { chartIDs } from '../../components/Chart/constants';
import Chart from '../../components/Chart/Chart';
import { PoolTradeTable } from './components/PoolTradeTable';
import useSwapHistory from '../../components/Chart/hooks/useSwapHistory';
import usePriceGraph from '../../components/Chart/hooks/usePriceGraph';
import {
  selectCertainMarket,
  selectCertainMarketLoading,
  selectCertainPair,
  selectCertainPairLoading,
} from '../../state/core/selectors';

export const PoolPage: FC = () => {
  const market = useSelector(selectCertainMarket);
  const pool = useSelector(selectCertainPair);
  const marketLoading = useSelector(selectCertainMarketLoading);
  const poolLoading = useSelector(selectCertainPairLoading);

  useFetchPair();
  useFetchMarket(pool?.market);

  const isLoading = marketLoading || poolLoading;

  const {
    chartDataActivity,
    swapHistoryLoading,
    currentPeriod,
    setCurrentPeriod,
  } = useSwapHistory({});

  const chartData = usePriceGraph({
    baseSpotPrice: pool?.baseSpotPrice,
    rawDelta: pool?.delta,
    rawFee: pool?.fee,
    bondingCurve: pool?.bondingCurve,
    buyOrdersAmount: pool?.buyOrdersAmount,
    nftsCount: pool?.nftsCount,
    mathCounter: pool?.mathCounter,
    type: pool?.type,
  });

  return (
    <AppLayout>
      <PageContentLayout>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <PoolHeader market={market} pool={pool} />
            <PoolGeneralInfo pool={pool} />
            <NftList pool={pool} />
            <Chart
              title="price graph"
              data={chartData}
              chartID={chartIDs.priceGraph}
              swapHistoryLoading={swapHistoryLoading}
            />
            <Chart
              title="swap history"
              data={chartDataActivity}
              chartID={chartIDs.swapHistory}
              currentPeriod={currentPeriod}
              setCurrentPeriod={setCurrentPeriod}
              swapHistoryLoading={swapHistoryLoading}
            />
            <PoolTradeTable />
          </>
        )}
      </PageContentLayout>
    </AppLayout>
  );
};
