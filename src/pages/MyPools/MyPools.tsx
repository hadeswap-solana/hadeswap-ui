import { FC, useEffect } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Avatar, Col, Row, Table, Button } from 'antd';

import { AppLayout } from '../../components/Layout/AppLayout';
import { coreActions } from '../../state/core/actions';
import {
  selectAllMarketsLoading,
  selectMyPoolsPageTableInfo,
  selectWalletPairsLoading,
} from '../../state/core/selectors';
import { TitleWithInfo } from '../Collections/TitleWithInfo';
import { Spinner } from '../../components/Spinner/Spinner';
import { useHistory } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { PriceWithIcon } from '../Collections/PriceWithIcon';

import styles from './MyPools.module.scss';

const { Title } = Typography;

const poolTableColumns: ColumnsType<
  ReturnType<typeof selectMyPoolsPageTableInfo>[0]
> = [
  {
    key: 'collection',
    title: 'Collection',
    dataIndex: 'collectionName',
    sorter: (a, b) => a?.collectionName.localeCompare(b?.collectionName),
    showSorterTooltip: false,
    render: (text, record) => {
      return (
        <Row align="middle" gutter={[8, 0]}>
          <Col>
            <Avatar src={record?.collectionImage} />
          </Col>
          <Col>{text}</Col>
        </Row>
      );
    },
  },
  {
    key: 'type',
    title: 'Pool type',
    dataIndex: 'type',
    sorter: (a, b) => a?.type.localeCompare(b?.type),
    showSorterTooltip: false,
    render: (text) => <Typography.Text>{text}</Typography.Text>,
  },
  {
    key: 'fundsSolOrTokenBalance',
    title: 'SOL balance',
    dataIndex: 'fundsSolOrTokenBalance',
    sorter: (a, b) =>
      parseFloat(a?.fundsSolOrTokenBalance) -
      parseFloat(b?.fundsSolOrTokenBalance),
    showSorterTooltip: false,
    render: (text, record) =>
      record.type === 'nftForToken' ? (
        <Typography.Text>--</Typography.Text>
      ) : (
        <PriceWithIcon price={text} />
      ),
  },
  {
    key: 'nftsCount',
    title: 'NFTs amount',
    dataIndex: 'nftsCount',
    sorter: ({ nftsCount: nftsAmountA = 0 }, { nftsCount: nftsAmountB = 0 }) =>
      nftsAmountA - nftsAmountB,
    showSorterTooltip: false,
    render: (text = 0, record) => (
      <Typography.Text>
        {record.type === 'tokenForNft' ? '--' : text}
      </Typography.Text>
    ),
  },
  {
    key: 'bondingCurve',
    title: 'Bonding curve',
    dataIndex: 'bondingCurve',
    sorter: (a, b) => a?.bondingCurve.localeCompare(b?.bondingCurve),
    showSorterTooltip: false,
    render: (text) => <Typography.Text>{text}</Typography.Text>,
  },
  {
    key: 'delta',
    title: <TitleWithInfo title="Delta" infoText="Delta param explanation" />,
    dataIndex: 'delta',
    sorter: (a, b) => parseFloat(a?.delta) - parseFloat(b?.delta),
    showSorterTooltip: false,
    render: (text) => <Typography.Text>{text}</Typography.Text>,
  },
  /*
  {
    key: 'pairState',
    title: 'Pool status',
    dataIndex: 'pairState',
    sorter: (a, b) => a?.pairState.localeCompare(b?.pairState),
    showSorterTooltip: false,
    render: (text) => <Typography.Text>{text}</Typography.Text>,
  },
  */
];

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
      <Title>My pools</Title>
      <div className={styles.buttons}>
        <Button
          onClick={() => {
            history.push('/create-pool');
          }}
        >
          + Create pool
        </Button>
      </div>
      {!wallet.connected && (
        <Typography.Title level={3}>
          Connect you wallet to see your pools
        </Typography.Title>
      )}
      {wallet.connected && loading && <Spinner />}
      {!loading && wallet.connected && !poolsTableInfo.length && (
        <Typography.Title level={3}>No pools found</Typography.Title>
      )}

      {!loading && wallet.connected && !!poolsTableInfo.length && (
        <Table
          columns={poolTableColumns}
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
