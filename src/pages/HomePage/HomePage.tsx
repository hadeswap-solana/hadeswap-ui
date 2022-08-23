import { AppLayout } from '../../components/Layout/AppLayout';

import styles from './HomePage.module.scss';

export const HomePage = (): JSX.Element => {
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
