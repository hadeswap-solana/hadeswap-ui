import { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Spinner } from '../../../../components/Spinner/Spinner';
import ItemsList from '../../../../components/ItemsList';
import { POOL } from '../../../../constants/common';
import { PubKeys } from '../../../../types';
import {
  selectMarketPairsLoading,
  selectCertainMarketLoading,
  selectPoolsTableInfo,
} from '../../../../state/core/selectors';
import styles from './styles.module.scss';

export const CollectionPoolsTab: FC = () => {
  const history = useHistory();

  const poolsTableInfo = useSelector(selectPoolsTableInfo);
  const marketPairsLoading = useSelector(selectMarketPairsLoading);
  const marketLoading = useSelector(selectCertainMarketLoading);

  const isLoading = marketPairsLoading || marketLoading;

  const onRowClick = (value) => {
    history.push(`/pools/${value}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className={styles.tabContentWrapper}>
      {isLoading ? (
        <Spinner />
      ) : (
        <ItemsList
          onRowClick={onRowClick}
          data={poolsTableInfo}
          mapType={POOL}
          pubKey={PubKeys.PAIR_PUBKEY}
        />
      )}
    </div>
  );
};
