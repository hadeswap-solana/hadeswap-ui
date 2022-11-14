import { FC } from 'react';
import { COLLECTION_ITEM, POOL_ITEM } from '../constants';
import { UNTITLED_COLLECTION, COLLECTION } from '../../../constants/common';
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
}): JSX.Element => {
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
          {itemMap.list.map((listItem) => (
            <li key={listItem.valueKey} className={styles.listItem}>
              <span>{listItem.title}</span>
              {listItem.render(item[listItem.valueKey], item)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CollectionItem;
