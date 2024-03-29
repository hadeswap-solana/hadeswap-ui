import { memo } from 'react';
import { ItemsList as ItemsListDesktop } from './ItemsList';
import { ItemsList as ItemsListMobile } from './mobile/ItemsList';
import { useSelector } from 'react-redux';
import { columnsType, mobileItemsType } from '../../utils/table';
import { selectScreeMode } from '../../state/common/selectors';
import { ScreenTypes } from '../../state/common/types';

export interface ItemsListProps<T> {
  idKey?: string;
  pubKey?: string;
  data: Array<T>;
  mapType: any;
  onRowClick?: (pubKey: string, source?: any) => void;
  tableClassName?: string;
}

const ItemsList = <T extends Record<string, any>>({
  idKey = null,
  onRowClick,
  data,
  mapType,
  pubKey,
  tableClassName,
}: ItemsListProps<T>) => {
  const screenMode = useSelector(selectScreeMode);
  const isMobile = screenMode !== ScreenTypes.DESKTOP;

  return isMobile ? (
    <ItemsListMobile
      idKey={idKey}
      pubKey={pubKey}
      data={data}
      mapType={mobileItemsType[mapType]}
      onRowClick={onRowClick}
    />
  ) : (
    <ItemsListDesktop
      idKey={idKey}
      pubKey={pubKey}
      data={data}
      mapType={columnsType[mapType]}
      onRowClick={onRowClick}
      tableClassName={tableClassName}
    />
  );
};

export default memo(ItemsList);
