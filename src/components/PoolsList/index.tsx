import { FC, memo } from 'react';
import { PoolsList as PoolsDesktop } from './PoolsList';
import { PoolsList as PoolsMobile } from './mobile/PoolsList';
import { useSelector } from 'react-redux';
import { selectScreeMode } from '../../state/common/selectors';
import { ScreenTypes } from '../../state/common/types';
import { createPoolTableRow } from '../../state/core/helpers';

export interface PoolsTableProps {
  onRowClick: (arg: string) => void;
  data: ReturnType<typeof createPoolTableRow>[];
}

const PoolsList: FC<PoolsTableProps> = ({ onRowClick, data }) => {
  const screenMode = useSelector(selectScreeMode);
  const isMobile = screenMode === ScreenTypes.TABLET;

  return isMobile ? (
    <PoolsMobile data={data} onRowClick={onRowClick} />
  ) : (
    <PoolsDesktop data={data} onRowClick={onRowClick} />
  );
};

export default memo(PoolsList);
