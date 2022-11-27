import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Typography } from 'antd';
import { useWallet } from '@solana/wallet-adapter-react';

import { useFetchWalletPairs, useFetchAllMarkets } from '../../requests';
import { AppLayout } from '../../components/Layout/AppLayout';
import PageContentLayout from '../../components/Layout/PageContentLayout';
import Button from '../../components/Buttons/Button';
import { Spinner } from '../../components/Spinner/Spinner';
import ItemsList from '../../components/ItemsList';
import Sorting from '../../components/Sorting/mobile/Sorting';
import { OpenSortButton } from '../../components/Sorting/mobile/OpenSortButton';
import { sortCollection } from '../../components/Sorting/mobile/helpers';
import { POOL_TABLE_COLUMNS } from '../../utils/table/constants';
import { SORT_ORDER, PubKeys, POOL } from '../../constants/common';
import {
  selectAllMarketsLoading,
  selectWalletPairsLoading,
  selectMyPoolsPageTableInfo,
} from '../../state/core/selectors';
import { selectScreeMode } from '../../state/common/selectors';
import { ScreenTypes } from '../../state/common/types';
import { createPoolTableRow } from '../../state/core/helpers';

import styles from './MyPools.module.scss';

export const MyPools: FC = () => {
  const history = useHistory();
  const { connected } = useWallet();

  const INITIAL_SORT_VALUE = 'collectionName';

  const [isSortingVisible, setIsSortingVisible] = useState<boolean>(false);
  const [sortValue, setSortValue] = useState<string>(
    `${INITIAL_SORT_VALUE}_${SORT_ORDER.ASC}`,
  );
  const [pools, setPools] = useState<
    Array<ReturnType<typeof createPoolTableRow>>
  >([]);

  const screenMode = useSelector(selectScreeMode);
  const isMobile = screenMode !== ScreenTypes.DESKTOP;

  const onRowClick = (value: string) => {
    history.push(`/pools/${value}`);
    window.scrollTo(0, 0);
  };

  useFetchAllMarkets();
  useFetchWalletPairs();

  const walletPairs = useSelector(selectMyPoolsPageTableInfo);

  const marketsLoading = useSelector(selectAllMarketsLoading);
  const pairsLoading = useSelector(selectWalletPairsLoading);
  const isLoading = marketsLoading || pairsLoading;

  useEffect(() => {
    !isLoading && setPools(walletPairs);
  }, [isLoading, walletPairs]);

  useEffect(() => {
    const [name, order] = sortValue.split('_');
    setPools(sortCollection(pools, name, order));
  }, [sortValue, pools]);

  return (
    <AppLayout>
      <PageContentLayout title="my pools">
        {!connected && (
          <Typography.Title level={3}>
            connect your wallet to see your pools
          </Typography.Title>
        )}
        {connected && isLoading && <Spinner />}
        {connected && !isLoading && !walletPairs.length && (
          <Typography.Title level={3}>no pools found</Typography.Title>
        )}
        {connected && !isLoading && !!pools.length && (
          <>
            <div className={styles.buttonWrapper}>
              <Button
                onClick={() => history.push('/create-pool')}
                className={styles.mainButton}
              >
                <span>create pool</span>
              </Button>
              {isMobile && !!pools.length && (
                <OpenSortButton setIsSortingVisible={setIsSortingVisible} />
              )}
            </div>
            <ItemsList
              data={pools}
              onRowClick={onRowClick}
              mapType={POOL}
              pubKey={PubKeys.PAIR_PUBKEY}
            />
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
      </PageContentLayout>
    </AppLayout>
  );
};
