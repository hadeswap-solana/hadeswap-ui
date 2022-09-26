import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Table, Button } from 'antd';

import { AppLayout } from '../../components/Layout/AppLayout';
import { coreActions } from '../../state/core/actions';
import {
  selectAllMarketsLoading,
  selectMyPoolsPageTableInfo,
  selectWalletPairsLoading,
} from '../../state/core/selectors';
import { Spinner } from '../../components/Spinner/Spinner';
import { useHistory } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { POOL_TABLE_COLUMNS } from '../../utils/table/constants';

import styles from './MyPools.module.scss';

const { Title } = Typography;

export const MyPools: FC = () => {
  const history = useHistory();
  const wallet = useWallet();
  const dispatch = useDispatch();

  const marketsLoading = useSelector(selectAllMarketsLoading);
  const poolsLoading = useSelector(selectWalletPairsLoading);

  const loading = marketsLoading || poolsLoading;

  useEffect(() => {
    if (wallet.connected) {
      dispatch(coreActions.fetchAllMarkets());
      dispatch(coreActions.fetchWalletPairs());
    }
  }, [dispatch, wallet]);

  const poolsTableInfo = useSelector(selectMyPoolsPageTableInfo);

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
          connect you wallet to see your pools
        </Typography.Title>
      )}
      {wallet.connected && loading && <Spinner />}
      {!loading && wallet.connected && !poolsTableInfo.length && (
        <Typography.Title level={3}>no pools found</Typography.Title>
      )}

      {!loading && wallet.connected && !!poolsTableInfo.length && (
        <Table
          columns={POOL_TABLE_COLUMNS}
          dataSource={poolsTableInfo}
          pagination={false}
          style={{ cursor: 'pointer' }}
          rowKey={(record) => record.pairPubkey}
          onRow={({ pairPubkey }) => {
            return {
              onClick: () => {
                history.push(`/pools/${pairPubkey}`);
                window.scrollTo(0, 0);
              },
            };
          }}
        />
      )}
    </AppLayout>
  );
};
