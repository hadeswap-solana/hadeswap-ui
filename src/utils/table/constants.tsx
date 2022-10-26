import { ColumnsType } from 'antd/es/table';
import { createPoolTableRow } from '../../state/core/helpers';
import { Avatar, Col, Row, Typography } from 'antd';
import { PriceWithIcon } from '../../components/PriceWithIcon';
import { formatBNToString } from '../index';
import { BN } from 'hadeswap-sdk';
import { TitleWithInfo } from '../../components/TitleWithInfo';
import { shortenAddress } from '../solanaUtils';

export const POOL_TABLE_COLUMNS: ColumnsType<ReturnType<typeof createPoolTableRow>> = [
  {
    key: 'collection',
    title: 'collection',
    dataIndex: 'collectionName',
    sorter: (a, b) => a?.collectionName?.localeCompare(b?.collectionName),
    showSorterTooltip: false,
    render: (
      text: string,
      record: ReturnType<typeof createPoolTableRow>,
    ): JSX.Element => {
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
    title: 'pool type',
    dataIndex: 'type',
    sorter: (a, b) => a?.type.localeCompare(b?.type),
    showSorterTooltip: false,
    render: (text) => <Typography.Text>{text}</Typography.Text>,
  },
  {
    key: 'spotPrice',
    title: 'spot price',
    dataIndex: 'spotPrice',
    sorter: (a, b) => parseFloat(a?.spotPrice) - parseFloat(b?.spotPrice),
    showSorterTooltip: false,
    render: (text) => <PriceWithIcon price={text} />,
  },
  {
    key: 'fee',
    title: 'fee',
    dataIndex: 'fee',
    sorter: (a, b) => a.fee - b.fee,
    showSorterTooltip: false,
    render: (text) => <Typography.Text>{text}%</Typography.Text>,
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
    key: 'buyOrdersAmount',
    title: 'buy orders',
    dataIndex: 'buyOrdersAmount',
    sorter: (
      { buyOrdersAmount: buyOrdersAmountA = 0 },
      { buyOrdersAmount: buyOrdersAmountB = 0 },
    ) => buyOrdersAmountA - buyOrdersAmountB,
    showSorterTooltip: false,
    render: (text = 0, record) => (
      <Typography.Text>
        {record.type === 'nftForToken' ? '--' : text}
      </Typography.Text>
    ),
  },
  {
    key: 'sellOrdersAmount',
    title: 'sell orders',
    dataIndex: 'sellOrdersAmount',
    sorter: (
      { sellOrdersAmount: sellOrdersAmountA = 0 },
      { sellOrdersAmount: nftsAmounsellOrdersAmountB = 0 },
    ) => sellOrdersAmountA - nftsAmounsellOrdersAmountB,
    showSorterTooltip: false,
    render: (text = 0, record) => (
      <Typography.Text>
        {record.type === 'tokenForNft' ? '--' : text}
      </Typography.Text>
    ),
  },
  {
    key: 'totalAccumulatedFees',
    title: 'accumulated fees',
    dataIndex: 'totalAccumulatedFees',
    sorter: (
      { totalAccumulatedFees: totalAccumulatedFeesA = 0 },
      { totalAccumulatedFees: totalAccumulatedFeesB = 0 },
    ) => totalAccumulatedFeesA - totalAccumulatedFeesB,
    showSorterTooltip: false,
    render: (text = 0, record) => (
      <Typography.Text>
        {record.type === 'liquidityProvision' ? (
          <PriceWithIcon price={formatBNToString(new BN(text || '0'))} />
        ) : (
          '--'
        )}
      </Typography.Text>
    ),
  },
  {
    key: 'delta',
    title: (
      <TitleWithInfo
        title="delta"
        infoText="impact (in SOL) for linear curve / impact (in %) for bonding curve"
      />
    ),
    dataIndex: 'delta',
    showSorterTooltip: false,
    render: (text) => <Typography.Text>{text}</Typography.Text>,
  },
  {
    key: 'ownerPublicKey',
    title: 'owner',
    dataIndex: 'ownerPublicKey',
    sorter: (a, b) => a?.ownerPublicKey.localeCompare(b?.ownerPublicKey),
    showSorterTooltip: false,
    render: (text: string) => (
      <Typography.Text>{shortenAddress(text)}</Typography.Text>
    ),
  },
];
