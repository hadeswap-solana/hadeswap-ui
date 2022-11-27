import { FC, memo } from 'react';
import { ItemsList as ItemsListDesktop } from './ItemsList';
import { columnsType } from '../../utils/table';

export interface ItemsListProps {
  onRowClick?: (pubKey: string, source?: any) => void;
  data: any[];
  mapType: any;
  pubKey?: string;
  tableClassName?: string;
}

const ItemsList: FC<ItemsListProps> = ({
  onRowClick,
  data,
  mapType,
  pubKey,
  tableClassName,
}) => (
  <ItemsListDesktop
    data={data}
    onRowClick={onRowClick}
    mapType={columnsType[mapType]}
    pubKey={pubKey}
    tableClassName={tableClassName}
  />
);

export default memo(ItemsList);
