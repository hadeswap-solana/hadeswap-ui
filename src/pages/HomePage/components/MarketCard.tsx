import { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { createCollectionLink } from '../../../constants';
import { SolanaLogo } from '../../../icons/SolanaLogo';
import { TopMarket } from '../../../requests/types';
import { UNTITLED } from '../../../constants/common';
import { formatRawSol } from '../../../utils/solanaUtils';

import styles from './styles.module.scss';

interface MarketCardProps {
  market: TopMarket;
}

export const MarketCard: FC<MarketCardProps> = ({ market }) => {
  const history = useHistory();
  const onMarketClick = () => {
    history.push(createCollectionLink(market.collectionPublicKey));
  };
  return (
    <li className={styles.marketCardWrapper} onClick={onMarketClick}>
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
        <div className={styles.marketInfoTitle}>
          {market.collectionName || UNTITLED}
        </div>
        <div className={styles.volume}>
          24h volume
          {/* <span className={styles.volumeValue}>+ 22.5%</span> */}
        </div>

        <div className={styles.marketInfoPrice}>
          {formatRawSol(market.volume24)}
          <SolanaLogo className={styles.marketInfoPriceLogo} />
        </div>
      </div>
    </li>
  );
};
