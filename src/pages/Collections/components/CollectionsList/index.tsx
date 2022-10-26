import { FC } from 'react';
import {  } from '../../../../components/CollectionList/CollectionList';
import { CollectionList as CollectionMobile } from './mobile/CollectionList';
import { MarketInfo } from '../../../../state/core/types';
import { ColumnsType } from 'antd/es/table';
import { useSelector } from 'react-redux';
import { selectScreeMode } from '../../../../state/common/selectors';
import { ScreenTypes } from '../../../../state/common/types';

export interface TableProps {
  data: MarketInfo[],
  dataSource?: MarketInfo[],
  onRowClick: (arg: string) => void,
  columns: ColumnsType,
  itemKey: string,
}

const CollectionList: FC<TableProps> = ({ columns, data, itemKey, onRowClick }) => {
  const screenMode = useSelector(selectScreeMode);
  const isMobile = screenMode === ScreenTypes.TABLET;

  return isMobile ?
    <CollectionMobile />
    : <CollectionDesktop itemKey={itemKey} columns={columns} onRowClick={onRowClick} data={data} />;
};

export default CollectionList;