import { FC, memo } from 'react';
import { ItemsList as ItemsListDesktop } from './ItemsList';
import { ItemsList as ItemsListMobile } from './mobile/ItemsList';
import { useSelector } from 'react-redux';
import { columnsType, mobileItemsType } from '../../utils/table';
import { selectScreeMode } from '../../state/common/selectors';
import { ScreenTypes } from '../../state/common/types';

export interface ItemsListProps {
  onRowClick?: (arg: string) => void;
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
}) => {
  const screenMode = useSelector(selectScreeMode);
  const isMobile = screenMode !== ScreenTypes.DESKTOP;

  return isMobile ? (
    <ItemsListMobile
      data={data}
      onRowClick={onRowClick}
      mapType={mobileItemsType[mapType]}
      pubKey={pubKey}
    />
  ) : (
    <ItemsListDesktop
      data={data}
      onRowClick={onRowClick}
      mapType={columnsType[mapType]}
      pubKey={pubKey}
      tableClassName={tableClassName}
    />
  );
};

export default memo(ItemsList);
