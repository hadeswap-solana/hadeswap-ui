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

  const isLoading = topMarketsLoading || allStatsLoading || TVLStatLoading;

  return (
    <AppLayout hideFooter={false}>
      <div className={styles.contentWrapper}>
        <h1 className={styles.h1}>
          the best NFT marketplace on{' '}
          <span className={styles.emphasis}>SOLANA</span> for traders
        </h1>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Stats TVLstat={TVLstat} allStats={allStats} />
            <TopMarkets topMarkets={topMarkets} />
          </>
        )}
      </div>
    </AppLayout>
  );
};
