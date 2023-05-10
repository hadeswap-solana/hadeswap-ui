import { FC } from 'react';
import { PnftBadge } from '../UI/PnftBadge';
import { UNTITLED_COLLECTION } from '../../constants/common';
import { ImageHolder } from '../UI/ImageHolder';

import styles from './styles.module.scss';

interface list {
  title: string;
  valueKey: string;
  render: (value: string | number, item: any[]) => JSX.Element;
}

interface ListItemMobileProps<T> {
  item: T;
  onRowClick: (arg: string) => void;
  itemMap: {
    itemKey: string;
    nameKey: string;
    imageKey: string;
    list: list[];
  };
}

const ListItemMobile: FC<ListItemMobileProps<any>> = ({
  item,
  onRowClick,
  itemMap,
}) => {
  return (
    <div
      key={item[itemMap.itemKey]}
      className={styles.cardWrapper}
      onClick={() => onRowClick(item[itemMap.itemKey])}
    >
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleBlock}>
          <ImageHolder imageUrl={item[itemMap.imageKey]} />
          <span>{item[itemMap.nameKey] || UNTITLED_COLLECTION}</span>
        </div>
        {item.isPnft && <PnftBadge className={styles.pnftBadge} />}
      </div>
      <div className={styles.cardBody}>
        <ul>
          {itemMap.list.map((listItem) => (
            <li key={listItem.valueKey} className={styles.listItem}>
              <span className={styles.listItemTitle}>{listItem.title}</span>
              {listItem.render(item[listItem.valueKey], item)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ListItemMobile;
