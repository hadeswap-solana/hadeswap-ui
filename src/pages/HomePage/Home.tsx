import { FC } from 'react';

import { AppLayout } from '../../components/Layout/AppLayout';
import styles from './Home.module.scss';

export const Home: FC = () => {
  return (
    <AppLayout>
      <div className={styles.root}>
        <h1>Hadeswap</h1>
        <h2>the most liquid NFT marketplace</h2>
        <p>Какой-то булщит напишем тут</p>
      </div>
    </AppLayout>
  );
};
