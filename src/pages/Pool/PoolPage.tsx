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
import { Chart, usePriceGraph } from '../../components/Chart';
import styles from './PoolPage.module.scss';

export const PoolPage: FC = () => {
  const market = useSelector(selectCertainMarket);
  const pool = useSelector(selectCertainPair);
  const marketLoading = useSelector(selectCertainMarketLoading);
  const poolLoading = useSelector(selectCertainPairLoading);

  const { data } = useQuery(['swapHistory', `${pool?.pairPubkey}`], () =>
    fetchSwapHistory(pool?.pairPubkey),
  );

  useFetchPair();
  useFetchMarket(pool?.market);

  const isLoading = marketLoading || poolLoading;

  const chartData = usePriceGraph({
    baseSpotPrice: pool?.baseSpotPrice,
    delta: pool?.delta,
    fee: pool?.fee,
    bondingCurve: pool?.bondingCurve,
    buyOrdersAmount: pool?.buyOrdersAmount,
    nftsCount: pool?.nftsCount,
    mathCounter: pool?.mathCounter,
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
            {!!chartData && !!chartData?.length && (
              <Chart
                title="price graph"
                data={chartData}
                className={styles.chart}
              />
            )}
          </>
        )}
      </PageContentLayout>
    </AppLayout>
  );
};
