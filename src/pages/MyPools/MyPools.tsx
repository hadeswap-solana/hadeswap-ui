import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Typography, Button } from 'antd';
import { useWallet } from '@solana/wallet-adapter-react';

import { AppLayout } from '../../components/Layout/AppLayout';
import { Spinner } from '../../components/Spinner/Spinner';
import PoolsList from '../../components/PoolsList';
import Sorting from '../../components/Sorting/mobile/Sorting';
import { OpenSortButton } from '../../components/Sorting/mobile/OpenSortButton';
import { sortCollection } from '../../components/Sorting/mobile/helpers';
import { POOL_TABLE_COLUMNS } from '../../utils/table/constants';
import { SORT_ORDER } from '../../constants/common';
import { selectScreeMode } from '../../state/common/selectors';
import { ScreenTypes } from '../../state/common/types';
import { coreActions } from '../../state/core/actions';
import {
  selectAllMarketsLoading,
  selectMyPoolsPageTableInfo,
  selectWalletPairsLoading,
} from '../../state/core/selectors';

import styles from './MyPools.module.scss';

const { Title } = Typography;

export const MyPools: FC = () => {
  const history = useHistory();
  const wallet = useWallet();
  const dispatch = useDispatch();

  const INITIAL_SORT_VALUE = 'collectionName';

  const [isSortingVisible, setIsSortingVisible] = useState<boolean>(false);
  const [sortValue, setSortValue] = useState<string>(
    `${INITIAL_SORT_VALUE}_${SORT_ORDER.ASC}`,
  );
  const [pools, setPools] = useState([]);

  const poolsTableInfo = useSelector(selectMyPoolsPageTableInfo);
  const marketsLoading = useSelector(selectAllMarketsLoading);
  const poolsLoading = useSelector(selectWalletPairsLoading);
  const screenMode = useSelector(selectScreeMode);
  const isMobile = screenMode === ScreenTypes.TABLET;

  const loading = marketsLoading || poolsLoading;

  const onRowClick = (value) => {
    history.push(`/pools/${value}`);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const [name, order] = sortValue.split('_');
    setPools(sortCollection([...poolsTableInfo], name, order));
  }, [sortValue, poolsTableInfo]);

  useEffect(() => {
    if (wallet.connected) {
      dispatch(coreActions.fetchAllMarkets());
      dispatch(coreActions.fetchWalletPairs());
    }
  }, [dispatch, wallet]);

  return (
    <AppLayout>
      <Title>my pools</Title>
      {wallet.connected && (
        <div className={styles.buttonsWrapper}>
          <Button
            onClick={() => {
              history.push('/create-pool');
            }}
          >
            + create pool
          </Button>
          {isMobile && !!poolsTableInfo.length && (
            <OpenSortButton setIsSortingVisible={setIsSortingVisible} />
          )}
        </div>
      )}
      {!wallet.connected && (
        <Typography.Title level={3}>
          connect your wallet to see your pools
        </Typography.Title>
      )}
      {wallet.connected && loading && <Spinner />}
      {!loading && wallet.connected && !poolsTableInfo.length && (
        <Typography.Title level={3}>no pools found</Typography.Title>
      )}

      {!loading && wallet.connected && !!poolsTableInfo.length && (
        <>
          <PoolsList data={pools} onRowClick={onRowClick} />
          {isMobile && isSortingVisible && (
            <Sorting
              setIsSortingVisible={setIsSortingVisible}
              sortValue={sortValue}
              setSortValue={setSortValue}
              data={POOL_TABLE_COLUMNS}
            />
          )}
        </>
      )}
    </AppLayout>
  );
};
