import { FC } from 'react';
import { MarketCard } from './MarketCard';
import { TopMarket } from '../../../requests/types';

import styles from './styles.module.scss';

export const TopMarkets: FC<{ topMarkets: TopMarket[] }> = ({ topMarkets }) => {
  topMarkets.length = 5;
  return (
    <>
      <h2 className={styles.topMarketsTitle}>All your awesome NFTs are here</h2>
      <ul className={styles.topMarkets}>
        {topMarkets.map((market, index) => (
          <MarketCard key={index} market={market} />
        ))}
      </ul>
    </>
  );
};
