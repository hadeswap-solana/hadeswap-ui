import { FC } from 'react';
import ListItemMobile from '../../ListItemMobile';
import { ItemsListProps } from '../index';

export const ItemsList: FC<ItemsListProps> = ({
  onRowClick,
  data,
  mapType,
  pubKey,
}) => (
  <>
    {data?.map((item) => (
      <ListItemMobile
        key={item[pubKey]}
        item={item}
        onRowClick={onRowClick}
        itemMap={mapType}
      />
    ))}
  </>
);
