import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Typography, Button } from 'antd';
import { useWallet } from '@solana/wallet-adapter-react';

import { useFetchAllMarketsAndPairs } from '../../requests';
import { combineMyPoolsPageTableInfo } from './helpers';
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
import { MarketInfo, Pair } from '../../state/core/types';

import styles from './MyPools.module.scss';

const { Title } = Typography;

export const MyPools: FC = () => {
  const history = useHistory();
  const { connected } = useWallet();

  const INITIAL_SORT_VALUE = 'collectionName';

  const [isSortingVisible, setIsSortingVisible] = useState<boolean>(false);
  const [sortValue, setSortValue] = useState<string>(
    `${INITIAL_SORT_VALUE}_${SORT_ORDER.ASC}`,
  );
  const [pools, setPools] = useState<
    Array<ReturnType<typeof combineMyPoolsPageTableInfo>>
  >([]);

  const screenMode = useSelector(selectScreeMode);
  const isMobile = screenMode === ScreenTypes.TABLET;

  const onRowClick = (value: string) => {
    history.push(`/pools/${value}`);
    window.scrollTo(0, 0);
  };

  const {
    data,
    isLoading,
  }: { data: (MarketInfo[] | Pair[])[]; isLoading: boolean } =
    useFetchAllMarketsAndPairs();
  const [markets, pairs] = data;

  useEffect(() => {
    !isLoading && setPools(combineMyPoolsPageTableInfo(markets, pairs));
  });

  useEffect(() => {
    const [name, order] = sortValue.split('_');
    setPools(sortCollection(pools, name, order));
  }, [sortValue, pools]);

  return (
    <AppLayout>
      <Title>my pools</Title>
      {connected && (
        <div className={styles.buttonsWrapper}>
          <Button
            onClick={() => {
              history.push('/create-pool');
            }}
          >
            + create pool
          </Button>
          {isMobile && !!pools.length && (
            <OpenSortButton setIsSortingVisible={setIsSortingVisible} />
          )}
        </div>
      )}
      {!connected && (
        <Typography.Title level={3}>
          connect your wallet to see your pools
        </Typography.Title>
      )}
      {connected && isLoading && <Spinner />}
      {!isLoading && connected && !pools.length && (
        <Typography.Title level={3}>no pools found</Typography.Title>
      )}

      {!isLoading && connected && !!pools.length && (
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
