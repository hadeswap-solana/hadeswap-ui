import { FC } from 'react';
import { SolPrice } from '../../../components/SolPrice/SolPrice';
import { TopMarket } from '../../../requests/types';
import { UNTITLED } from '../../../constants/common';

import styles from './styles.module.scss';

interface MarketCardProps {
  market: TopMarket;
}

export const MarketCard: FC<MarketCardProps> = ({ market }) => (
  <li className={styles.marketCardWrapper}>
    <img
      className={styles.marketImage}
      src={market.collectionImage}
      alt={market.collectionName}
    />
    <div className={styles.marketInfo}>
      <span className={styles.marketInfoTitle}>
        {market.collectionName || UNTITLED}
      </span>
      <SolPrice
        className={styles.marketInfoPrice}
        price={parseFloat(market.volume24)}
      />
    </div>
  </li>
);
