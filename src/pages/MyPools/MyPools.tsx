import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Typography, Button } from 'antd';
import { useWallet } from '@solana/wallet-adapter-react';

import { AppLayout } from '../../components/Layout/AppLayout';
import Table from '../Collections/mobile/CollectionsList';
import { PoolsList } from './components/PoolsList';
import { Spinner } from '../../components/Spinner/Spinner';
import { POOL_TABLE_COLUMNS } from '../../utils/table/constants';
import { coreActions } from '../../state/core/actions';
import {
  selectAllMarketsLoading,
  selectMyPoolsPageTableInfo,
  selectWalletPairsLoading,
} from '../../state/core/selectors';
import { selectScreeMode } from '../../state/common/selectors';
import { ScreenTypes } from '../../state/common/types';

import styles from './MyPools.module.scss';

const { Title } = Typography;

export const MyPools: FC = () => {
  const history = useHistory();
  const wallet = useWallet();
  const dispatch = useDispatch();

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
    if (wallet.connected) {
      dispatch(coreActions.fetchAllMarkets());
      dispatch(coreActions.fetchWalletPairs());
    }
  }, [dispatch, wallet]);

  const poolsTableInfo = useSelector(selectMyPoolsPageTableInfo);
  //console.log('poolsTableInfo', poolsTableInfo);
  return (
    <AppLayout>
      <Title>my pools</Title>
      {wallet.connected && (
        <div className={styles.buttons}>
          <Button
            onClick={() => {
              history.push('/create-pool');
            }}
          >
            + create pool
          </Button>
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
        <Table
          columns={POOL_TABLE_COLUMNS}
          data={poolsTableInfo}
          onRowClick={onRowClick}
          dataKey="pairPubkey"
        />
      )}
    </AppLayout>
  );
};
