import { FC, memo } from 'react';
import { CollectionList as CollectionMobile } from './mobile/CollectionList';
import { CollectionList as CollectionDesktop } from './CollectionList';
import { useSelector } from 'react-redux';
import { selectScreeMode } from '../../state/common/selectors';
import { ScreenTypes } from '../../state/common/types';
import { MarketInfo } from '../../state/core/types';

export interface CollectionTableProps {
  data: MarketInfo[];
  onRowClick: (arg: string) => void;
}

const CollectionList: FC<CollectionTableProps> = ({ data, onRowClick }) => {
  const screenMode = useSelector(selectScreeMode);
  const isMobile = screenMode === ScreenTypes.TABLET;

  return isMobile ? (
    <CollectionMobile onRowClick={onRowClick} data={data} />
  ) : (
    <CollectionDesktop onRowClick={onRowClick} data={data} />
  );
};

export default memo(CollectionList);
