import { FC } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { Avatar, Col, Row, Table, Typography } from 'antd';

import { CollectionPageLayout } from './CollectionPageLayout';
import deGodsLogo from '../../assets/mockImages/deGodsLogo.jpg';
import { PriceWithIcon } from '../Collections/PriceWithIcon';
import { TitleWithInfo } from '../Collections/TitleWithInfo';
import { shortenAddress } from '../../utils/solanaUtils';
import { useHistory } from 'react-router-dom';

enum PoolType {
  BUY = 'Buy',
  SELL = 'Sell',
  liquidity = 'Liquidity',
}

enum BondingCurveType {
  EXPONENTIAL = 'Exponential',
  LINEAR = 'Linear',
}

export type PoolData = {
  publicKey: string;
  ownerPublicKey: string;
  collectionName: string;
  collectionImage: string;
  type: PoolType;
  solBalance?: string;
  nftsAmount?: number;
  currentPrice: string;
  bondingCurve: BondingCurveType;
  delta: string;
  volume: string;
};

const mockData: PoolData[] = [
  {
    publicKey: '11111111111111111111111111111111',
    ownerPublicKey: '11111111111111111111111111111111',
    collectionName: 'DeGods',
    collectionImage: deGodsLogo,
    type: PoolType.liquidity,
    solBalance: '709.23',
    nftsAmount: 5,
    currentPrice: '400.01',
    bondingCurve: BondingCurveType.LINEAR,
    delta: '5',
    volume: '545.45',
  },
  {
    publicKey: '11111111111111111111111111111111',
    ownerPublicKey: '11111111111111111111111111111111',
    collectionName: 'DeGods',
    collectionImage: deGodsLogo,
    type: PoolType.BUY,
    solBalance: '540.23',
    currentPrice: '400.01',
    bondingCurve: BondingCurveType.LINEAR,
    delta: '5',
    volume: '545.45',
  },
  {
    publicKey: '11111111111111111111111111111111',
    ownerPublicKey: '11111111111111111111111111111111',
    collectionName: 'DeGods',
    collectionImage: deGodsLogo,
    type: PoolType.SELL,
    nftsAmount: 50,
    currentPrice: '420.01',
    bondingCurve: BondingCurveType.EXPONENTIAL,
    delta: '5',
    volume: '545.45',
  },
];

const poolTableColumns: ColumnsType<PoolData> = [
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
    key: 'solBalance',
    title: 'SOL balance',
    dataIndex: 'solBalance',
    sorter: (a, b) => parseFloat(a?.solBalance) - parseFloat(b?.solBalance),
    showSorterTooltip: false,
    render: (text) =>
      text ? (
        <PriceWithIcon price={text} />
      ) : (
        <Typography.Text>--</Typography.Text>
      ),
  },
  {
    key: 'nftsAmount',
    title: 'NFTs amount',
    dataIndex: 'nftsAmount',
    sorter: (
      { nftsAmount: nftsAmountA = 0 },
      { nftsAmount: nftsAmountB = 0 },
    ) => nftsAmountA - nftsAmountB,
    showSorterTooltip: false,
    render: (text = '--') => <Typography.Text>{text}</Typography.Text>,
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
  {
    key: 'volume',
    title: 'Volume',
    dataIndex: 'volume',
    sorter: (a, b) => parseFloat(a?.volume) - parseFloat(b?.volume),
    showSorterTooltip: false,
    render: (text) => <Typography.Text>{text}</Typography.Text>,
  },
  {
    key: 'ownerPublicKey',
    title: 'Owner',
    dataIndex: 'ownerPublicKey',
    sorter: (a, b) => a?.ownerPublicKey.localeCompare(b?.ownerPublicKey),
    showSorterTooltip: false,
    render: (text: string) => (
      <Typography.Text>{shortenAddress(text)}</Typography.Text>
    ),
  },
];

export const CollectionPoolsPage: FC = () => {
  const history = useHistory();

  return (
    <CollectionPageLayout>
      <Table
        columns={poolTableColumns}
        dataSource={mockData}
        pagination={false}
        style={{ cursor: 'pointer' }}
        onRow={({ publicKey }) => {
          return {
            onClick: () => {
              history.push(`/pool/${publicKey}`);
              window.scrollTo(0, 0);
            },
          };
        }}
      />
    </CollectionPageLayout>
  );
};
