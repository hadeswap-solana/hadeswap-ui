import { FC } from 'react';
import { COLLECTION_ITEM, POOL_ITEM, OWNER_PUBLIC_KEY } from '../constants';
import { UNTITLED_COLLECTION, COLLECTION } from '../../../constants/common';
import { shortenAddress } from '../../../utils/solanaUtils';
import { PriceWithIcon } from '../../PriceWithIcon';
import styles from './CollectionItem.module.scss';
import { createPoolTableRow } from '../../../state/core/helpers';
import { MarketInfo } from '../../../state/core/types';

interface CollectionItemsProps {
  item: ReturnType<typeof createPoolTableRow> | MarketInfo;
  onRowClick: (arg: string) => void;
  listingType?: string;
}

const CollectionItem: FC<CollectionItemsProps> = ({
  item,
  onRowClick,
  listingType,
}) => {
  const itemMap = listingType === COLLECTION ? COLLECTION_ITEM : POOL_ITEM;

  return (
    <div
      key={item[itemMap.itemKey]}
      className={styles.cardWrapper}
      onClick={() => onRowClick(item[itemMap.itemKey])}
    >
      <div className={styles.cardHeader}>
        <img src={item[itemMap.imageKey]} alt={item[itemMap.nameKey]} />
        <span>{item[itemMap.nameKey] || UNTITLED_COLLECTION}</span>
      </div>
      <div className={styles.cardBody}>
        <ul>
          {itemMap.list.map((listItem) => {
            let value = item[listItem.valueKey];
            value =
              listItem.valueKey === OWNER_PUBLIC_KEY
                ? shortenAddress(value)
                : value;

            return (
              <li key={listItem.valueKey} className={styles.listItem}>
                <span>{listItem.title}</span>
                {listItem.price ? (
                  <PriceWithIcon price={value ? value : '0'} rightIcon />
                ) : (
                  <span>
                    {value}
                    {listItem.percent && '%'}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default CollectionItem;
