import { FC } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { Avatar, Col, Row, Table, Typography } from 'antd';
import { CollectionPageLayout } from './CollectionPageLayout';
import { PriceWithIcon } from '../Collections/PriceWithIcon';
import { TitleWithInfo } from '../Collections/TitleWithInfo';
import { shortenAddress } from '../../utils/solanaUtils';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectPoolsPageTableInfo } from '../../state/core/selectors';

const poolTableColumns: ColumnsType<
  ReturnType<typeof selectPoolsPageTableInfo>[0]
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
    render: (text) =>
      text ? (
        <PriceWithIcon price={text} />
      ) : (
        <Typography.Text>--</Typography.Text>
      ),
  },
  {
    key: 'nftsCount',
    title: 'NFTs amount',
    dataIndex: 'nftsCount',
    sorter: ({ nftsCount: nftsAmountA = 0 }, { nftsCount: nftsAmountB = 0 }) =>
      nftsAmountA - nftsAmountB,
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

  const poolsTableInfo = useSelector(selectPoolsPageTableInfo);

  return (
    <CollectionPageLayout>
      <Table
        columns={poolTableColumns}
        dataSource={poolsTableInfo}
        pagination={false}
        style={{ cursor: 'pointer' }}
        onRow={({ pairPubkey }) => {
          return {
            onClick: () => {
              history.push(`/pools/${pairPubkey}`);
              window.scrollTo(0, 0);
            },
          };
        }}
      />
    </CollectionPageLayout>
  );
};