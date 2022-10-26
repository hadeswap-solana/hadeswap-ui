import { FC } from 'react';
import { CollectionList as CollectionMobile } from "./mobile/CollectionList";
import { CollectionList as CollectionDesktop } from './CollectionList'
import { MarketInfo } from '../../../../state/core/types';
import { useSelector } from 'react-redux';
import { selectScreeMode } from '../../../../state/common/selectors';
import { ScreenTypes } from '../../../../state/common/types';

export interface TableProps {
  data: MarketInfo[],
  onRowClick: (arg: string) => void,
}

const CollectionList: FC<TableProps> = ({data, onRowClick }) => {
  const screenMode = useSelector(selectScreeMode);
  const isMobile = screenMode === ScreenTypes.TABLET;

  return isMobile ?
    <CollectionMobile onRowClick={onRowClick} data={data}/>
    : <CollectionDesktop onRowClick={onRowClick} data={data}/>;
};

export default CollectionList;