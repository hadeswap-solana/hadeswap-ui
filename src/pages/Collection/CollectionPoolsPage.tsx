import { FC } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { Avatar, Col, Row, Table, Typography } from 'antd';
import { CollectionPageLayout } from './CollectionPageLayout';
import { PriceWithIcon } from '../Collections/PriceWithIcon';
import { TitleWithInfo } from '../Collections/TitleWithInfo';
import { shortenAddress } from '../../utils/solanaUtils';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  selectMarketPairsLoading,
  selectPoolsPageTableInfo,
} from '../../state/core/selectors';
import { Spinner } from '../../components/Spinner/Spinner';

const poolTableColumns: ColumnsType<
  ReturnType<typeof selectPoolsPageTableInfo>[0]
> = [
  {
    key: 'collection',
    title: 'collection',
    dataIndex: 'collectionName',
    sorter: (a, b) => a?.collectionName?.localeCompare(b?.collectionName),
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
    key: 'nftsCount',
    title: 'amount of NFTs',
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
    title: 'bonding curve',
    dataIndex: 'bondingCurve',
    sorter: (a, b) => a?.bondingCurve.localeCompare(b?.bondingCurve),
    showSorterTooltip: false,
    render: (text) => <Typography.Text>{text}</Typography.Text>,
  },
  {
    key: 'delta',
    title: <TitleWithInfo title="delta" infoText="delta param explanation" />,
    dataIndex: 'delta',
    sorter: (a, b) => parseFloat(a?.delta) - parseFloat(b?.delta),
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

export const CollectionPoolsPage: FC = () => {
  const history = useHistory();

  const poolsTableInfo = useSelector(selectPoolsPageTableInfo);
  const loading = useSelector(selectMarketPairsLoading);

  return (
    <CollectionPageLayout>
      {loading ? (
        <Spinner />
      ) : (
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
    </CollectionPageLayout>
  );
};
