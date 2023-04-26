import ListItemMobile from '../../ListItemMobile';
import { ItemsListProps } from '../index';

export const ItemsList = <T extends Record<string, any>>({
  idKey,
  pubKey,
  data,
  mapType,
  onRowClick,
}: ItemsListProps<T>): JSX.Element => (
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
