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
import { Chart, usePriceGraph } from '../../components/Chart';
import styles from './PoolPage.module.scss';
import { PoolTradeTable } from './components/PoolTradeTable';
import { BondingCurveType } from 'hadeswap-sdk/lib/hadeswap-core/types';

export const PoolPage: FC = () => {
  const market = useSelector(selectCertainMarket);
  const pool = useSelector(selectCertainPair);
  const marketLoading = useSelector(selectCertainMarketLoading);
  const poolLoading = useSelector(selectCertainPairLoading);

  useFetchPair();
  useFetchMarket(pool?.market);

  const isLoading = marketLoading || poolLoading;

  const chartData = usePriceGraph({
    baseSpotPrice: pool?.baseSpotPrice,
    delta:
      pool?.bondingCurve === BondingCurveType.XYK
        ? pool?.nftsCount
        : pool?.delta,
    fee: pool?.fee,
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
            {!!chartData && !!chartData?.length && (
              <div className={styles.chartWrapper}>
                <Chart title="price graph" data={chartData} />
              </div>
            )}
            <PoolTradeTable />
          </>
        )}
      </PageContentLayout>
    </AppLayout>
  );
};
