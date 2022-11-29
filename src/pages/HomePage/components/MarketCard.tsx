import { FC } from 'react';
import { SolanaLogo } from '../../../icons/SolanaLogo';
import { TopMarket } from '../../../requests/types';
import { UNTITLED } from '../../../constants/common';
import { formatPriceNumber } from '../../../utils/solanaUtils';

import styles from './styles.module.scss';

interface MarketCardProps {
  market: TopMarket;
}

export const MarketCard: FC<MarketCardProps> = ({ market }) => (
  <li className={styles.marketCardWrapper}>
    <div className={styles.marketImageWrapper}>
      {market.collectionImage && (
        <img
          className={styles.marketImage}
          src={market.collectionImage}
          alt={market.collectionName}
        />
      )}
    </div>
    <div className={styles.marketInfo}>
      <span className={styles.marketInfoTitle}>
        {market.collectionName || UNTITLED}
      </span>
      <div className={styles.marketInfoPriceWrapper}>
        <SolanaLogo className={styles.marketInfoPriceLogo} />
        <span className={styles.marketInfoPrice}>
          {formatPriceNumber.format(Number((market.volume24 / 1e9).toFixed(3)))}
        </span>
      </div>
    </div>
  </li>
);
