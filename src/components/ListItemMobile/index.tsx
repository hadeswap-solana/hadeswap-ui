import { FC } from 'react';
import { UNTITLED_COLLECTION } from '../../constants/common';

import styles from './styles.module.scss';

interface list {
  title: string;
  valueKey: string;
  render: (value: string | number, item: any[]) => JSX.Element;
}

interface ListItemMobileProps {
  item: any[];
  onRowClick: (arg: string) => void;
  itemMap: {
    itemKey: string;
    nameKey: string;
    imageKey: string;
    list: list[];
  };
}

const ListItemMobile: FC<ListItemMobileProps> = ({
  item,
  onRowClick,
  itemMap,
}) => (
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
            <span className={styles.listItemTitle}>{listItem.title}</span>
            {listItem.render(item[listItem.valueKey], item)}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default ListItemMobile;
