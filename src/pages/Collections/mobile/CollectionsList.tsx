import { FC } from 'react';
import { Index } from '../../../components/PriceWithIcon';
import { UNTITLED_COLLECTION } from '../Collections.constants';
import { MarketInfo } from '../../../state/core/types';
import styles from './CollectionsList.module.scss';

interface CollectionsListProps {
  data: MarketInfo[];
  onRowClick: (marketPubkey: string) => void;
}

export const CollectionsList: FC<CollectionsListProps> = ({
  data,
  onRowClick,
}) => (
  <>
    {data.map((item) => (
      <div
        key={item.marketPubkey}
        className={styles.cardWrapper}
        onClick={() => onRowClick(item.marketPubkey)}
      >
        <div className={styles.cardHeader}>
          <img src={item.collectionImage} alt={item.collectionName} />
          <span>{item.collectionName || UNTITLED_COLLECTION}</span>
        </div>
        <div className={styles.cardBody}>
          <ul>
            <li className={styles.listItem}>
              <span>LISTINGS</span>
              <span>{item.listingsAmount}</span>
            </li>
            <li className={styles.listItem}>
              <span>FLOOR PRICE</span>
              <Index price={item.floorPrice} rightIcon />
            </li>
            <li className={styles.listItem}>
              <span>BEST OFFER</span>
              <Index price={item.bestoffer} rightIcon />
            </li>
            <li className={styles.listItem}>
              <span>OFFER TVL</span>
              <Index price={item.offerTVL} rightIcon />
            </li>
          </ul>
        </div>
      </div>
    ))}
  </>
);
