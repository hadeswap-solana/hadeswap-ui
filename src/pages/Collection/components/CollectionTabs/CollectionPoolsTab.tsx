import { FC, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Spinner } from '../../../../components/Spinner/Spinner';
import ItemsList from '../../../../components/ItemsList';
import { sortCollection } from '../../../../components/Sorting/mobile/helpers';
import { POOL, SORT_ORDER } from '../../../../constants/common';
import { PubKeys } from '../../../../types';

import {
  selectMarketPairsLoading,
  selectCertainMarketLoading,
  selectPoolsTableInfo,
} from '../../../../state/core/selectors';
import { Pair } from '../../../../state/core/types';

import styles from './styles.module.scss';

export const CollectionPoolsTab: FC = () => {
  const INITIAL_SORT_VALUE = 'fundsSolOrTokenBalance';
  const history = useHistory();

  const [pools, setPools] = useState<Pair[]>([]);

  const poolsTableInfo = useSelector(selectPoolsTableInfo);
  const marketPairsLoading = useSelector(selectMarketPairsLoading);
  const marketLoading = useSelector(selectCertainMarketLoading);

  const isLoading = marketPairsLoading || marketLoading;

  const onRowClick = (value) => {
    history.push(`/pools/${value}`);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    setPools(
      sortCollection(poolsTableInfo, INITIAL_SORT_VALUE, SORT_ORDER.DESC),
    );
  }, [poolsTableInfo]);

  return (
    <div className={styles.tabContentWrapper}>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {pools.length ? (
            <ItemsList
              onRowClick={onRowClick}
              data={pools}
              mapType={POOL}
              pubKey={PubKeys.PAIR_PUBKEY}
            />
          ) : (
            <h2 className={styles.h2}>no pools</h2>
          )}
        </>
      )}
    </div>
  );
};
