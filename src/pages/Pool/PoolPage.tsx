import { FC } from 'react';
import { useSelector } from 'react-redux';
import { useFetchPair, useFetchMarket } from '../../requests';
import { AppLayout } from '../../components/Layout/AppLayout';
import PageContentLayout from '../../components/Layout/PageContentLayout';
import { PoolHeader } from './components/PoolHeader';
import { PoolGeneralInfo } from './components/PoolGeneralInfo';
import { NftList } from './components/NftList';
import { Spinner } from '../../components/Spinner/Spinner';
import {
  selectCertainMarket,
  selectCertainMarketLoading,
  selectCertainPair,
  selectCertainPairLoading,
} from '../../state/core/selectors';
import { useQuery } from '@tanstack/react-query';
import { fetchSwapHistory } from '../../requests/requests';
import SwapHistoryChart from '../../components/Chart/SwapHistoryChart';
import { Chart } from '../../components/Chart';

export const PoolPage: FC = () => {
  const market = useSelector(selectCertainMarket);
  const pool = useSelector(selectCertainPair);
  const marketLoading = useSelector(selectCertainMarketLoading);
  const poolLoading = useSelector(selectCertainPairLoading);

  const { data } = useQuery(['top20', `${pool?.pairPubkey}`], () =>
    fetchSwapHistory(pool?.pairPubkey),
  );

  console.log(data, 'data');

  useFetchPair();
  useFetchMarket(pool?.market);

  const isLoading = marketLoading || poolLoading;

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
              baseSpotPrice={pool.baseSpotPrice}
              delta={pool.delta}
              fee={pool.fee}
              type={pool.type}
              bondingCurve={pool.bondingCurve}
              buyOrdersAmount={pool.buyOrdersAmount}
              nftsCount={pool.nftsCount}
              mathCounter={pool.mathCounter}
            />
            {!isLoading && <SwapHistoryChart history={data} />}
          </>
        )}
      </PageContentLayout>
    </AppLayout>
  );
};
