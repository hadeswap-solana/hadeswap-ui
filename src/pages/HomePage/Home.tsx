import { FC } from 'react';
import { AppLayout } from '../../components/Layout/AppLayout';
import { Stats } from './components/Stats';
import { TopMarkets } from './components/TopMarkets';
import { Spinner } from '../../components/Spinner/Spinner';

import styles from './Home.module.scss';
import { useFetchAllStats, useFetchTVL, useTopMarkets } from './hooks';

export const Home: FC = () => {
  const { topMarkets, topMarketsLoading } = useTopMarkets();
  const { allStats, allStatsLoading } = useFetchAllStats();
  const { TVLstat, TVLStatLoading } = useFetchTVL();

  const isTotalLoading = topMarketsLoading && allStatsLoading && TVLStatLoading;

  return (
    <AppLayout>
      <div className={styles.contentWrapper}>
        <h1 className={styles.h1}>
          the best NFT marketplace on{' '}
          <span className={styles.emphasis}>SOLANA</span> for traders
        </h1>
        {isTotalLoading ? (
          <Spinner />
        ) : (
          <>
            {!isTotalLoading && (allStatsLoading || TVLStatLoading) ? (
              <Spinner />
            ) : (
              <Stats TVLstat={TVLstat} allStats={allStats} />
            )}
            {!isTotalLoading && topMarketsLoading ? (
              <Spinner />
            ) : (
              <TopMarkets topMarkets={topMarkets} />
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
};
