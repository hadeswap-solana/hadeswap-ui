import { FC } from 'react';
import { BN } from 'hadeswap-sdk';
import {
  COLLECTION_ITEM,
  POOL_ITEM,
  OWNER_PUBLIC_KEY,
  TOTAL_ACCUMULATED_FEES,
} from '../constants';
import { UNTITLED_COLLECTION, COLLECTION } from '../../../constants/common';
import { formatBNToString } from '../../../utils';
import { shortenAddress } from '../../../utils/solanaUtils';
import { PriceWithIcon } from '../../PriceWithIcon';
import { createPoolTableRow } from '../../../state/core/helpers';
import { MarketInfo } from '../../../state/core/types';

import styles from './CollectionItem.module.scss';

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

            if (listItem.valueKey === OWNER_PUBLIC_KEY) {
              value = shortenAddress(value);
            }

            if (listItem.valueKey === TOTAL_ACCUMULATED_FEES) {
              value = formatBNToString(new BN(value || '0'));
            }

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
