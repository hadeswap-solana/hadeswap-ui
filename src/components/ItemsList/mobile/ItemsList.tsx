import { FC } from 'react';
import ListItemMobile from '../../ListItemMobile';
import { ItemsListProps } from '../index';

export const ItemsList: FC<ItemsListProps> = ({
  idKey,
  pubKey,
  data,
  mapType,
  onRowClick,
}) => (
  <>
    {data?.map((item) => (
      <ListItemMobile
        key={item[idKey || pubKey]}
        item={item}
        onRowClick={onRowClick}
        itemMap={mapType}
      />
    ))}
  </>
);
