import { FC } from 'react';
import { CollectionPageLayout } from './CollectionPageLayout';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PoolsList from '../../components/PoolsList';
import {
  selectMarketPairsLoading,
  selectPoolsTableInfo,
} from '../../state/core/selectors';
import { Spinner } from '../../components/Spinner/Spinner';

export const CollectionPoolsPage: FC = () => {
  const history = useHistory();
  const poolsTableInfo = useSelector(selectPoolsTableInfo);
  const loading = useSelector(selectMarketPairsLoading);

  const onRowClick = (value) => {
    history.push(`/pools/${value}`);
    window.scrollTo(0, 0);
  };

  return (
    <CollectionPageLayout>
      {loading ? (
        <Spinner />
      ) : (
        <PoolsList onRowClick={onRowClick} data={poolsTableInfo} />
      )}
    </CollectionPageLayout>
  );
};
