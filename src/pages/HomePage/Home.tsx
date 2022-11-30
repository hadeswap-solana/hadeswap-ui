import { FC } from 'react';
import { AppLayout } from '../../components/Layout/AppLayout';
import { Stats } from './components/Stats';
import { TopMarkets } from './components/TopMarkets';

import styles from './Home.module.scss';

export const Home: FC = () => {
  return (
    <AppLayout>
      <div className={styles.contentWrapper}>
        <h1 className={styles.h1}>
          the best NFT marketplace on{' '}
          <span className={styles.emphasis}>SOLANA</span> for traders
        </h1>
        <Stats />
        <TopMarkets />
      </div>
    </AppLayout>
  );
};
