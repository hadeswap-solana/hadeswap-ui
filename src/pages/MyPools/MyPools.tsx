import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';

import { useFetchWalletPairs, useFetchAllMarkets } from '../../requests';
import { AppLayout } from '../../components/Layout/AppLayout';
import PageContentLayout from '../../components/Layout/PageContentLayout';
import { CreatePoolButton } from '../../components/CreatePoolButton/CreatePoolButton';
import { Spinner } from '../../components/Spinner/Spinner';
import ItemsList from '../../components/ItemsList';
import Sorting from '../../components/Sorting/mobile/Sorting';
import { OpenSortButton } from '../../components/Sorting/mobile/OpenSortButton';
import { sortCollection } from '../../components/Sorting/mobile/helpers';
import { POOL_TABLE_COLUMNS } from '../../utils/table/constants';
import { SORT_ORDER, POOL } from '../../constants/common';
import { PubKeys } from '../../types';
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
    const [name, order] = sortValue.split('_');
    setPools(sortCollection(walletPairs, name, order));
  }, [sortValue, walletPairs]);

  return (
    <AppLayout>
      <PageContentLayout title="my pools">
        {!connected && (
          <h2 className={styles.h2}>connect your wallet to see your pools</h2>
        )}
        {connected && isLoading && <Spinner />}
        {connected && !isLoading && !walletPairs.length && (
          <h2 className={styles.h2}>no pools found</h2>
        )}
        {connected && !isLoading && (
          <div className={styles.buttonWrapper}>
            <div className={styles.poolButtonWrapper}>
              <CreatePoolButton />
            </div>
            {isMobile && !!pools.length && (
              <div className={styles.sortButtonWrapper}>
                <OpenSortButton setIsSortingVisible={setIsSortingVisible} />
              </div>
            )}
          </div>
        )}
        {connected && !isLoading && !!pools.length && (
          <>
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
