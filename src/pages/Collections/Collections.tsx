import { Typography, Row, Col, Table, Avatar } from 'antd';
import { FC } from 'react';
import data from './mockData';
import type { ColumnsType } from 'antd/es/table';
import { Link } from 'react-router-dom';
import { AppLayout } from '../../components/Layout/AppLayout';
import { PriceWithIcon } from './PriceWithIcon';
import { TitleWithInfo } from './TitleWithInfo';

const { Title, Text } = Typography;
interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const columns: ColumnsType<DataType> = [
  {
    key: 'name',
    title: 'Name',
    dataIndex: 'name',
    sorter: (a, b) => a?.name.localeCompare(b?.name),
    showSorterTooltip: false,
    render: (text, record) => {
      return (
        <Row align="middle" gutter={[8, 0]}>
          <Col>
            <Avatar src={record?.imageLink} />
          </Col>
          <Col>{text}</Col>
        </Row>
      );
    },
  },
  {
    key: 'listingsCount',
    title: 'Listings',
    dataIndex: 'listingsCount',
    sorter: (a, b) => a?.listingsCount - b?.listingsCount,
    showSorterTooltip: false,
    render: (text) => <Text>{text}</Text>,
  },
  {
    key: 'floorPrice',
    title: (
      <TitleWithInfo
        title="Floor Price"
        infoText="The price of the cheapset NFT lested."
      />
    ),
    dataIndex: 'floorPrice',
    sorter: (a, b) => a?.floorPrice - b?.floorPrice,
    showSorterTooltip: false,
    render: (text) => <PriceWithIcon price={text} />,
  },
  {
    key: 'bestOfferPrice',
    title: (
      <TitleWithInfo
        title="Best Offer"
        infoText="The value of the highest collection offer."
      />
    ),
    dataIndex: 'bestOfferPrice',
    sorter: (a, b) => a?.bestOfferPrice - b?.bestOfferPrice,
    showSorterTooltip: false,
    render: (text) => <PriceWithIcon price={text} />,
  },
  {
    key: 'offerTVL',
    title: (
      <TitleWithInfo
        title="Best Offer"
        infoText="The total amount of SOL locked in collection offers."
      />
    ),
    dataIndex: 'offerTVL',
    sorter: (a, b) => a?.offerTVL - b?.offerTVL,
    showSorterTooltip: false,
    render: (text) => <PriceWithIcon price={text} />,
  },
  {
    key: 'volume',
    title: (
      <TitleWithInfo
        title="Volume"
        infoText="The total amount of SOL traded."
      />
    ),
    dataIndex: 'volume',
    sorter: (a, b) => a?.volume - b?.volume,
    showSorterTooltip: false,
    render: (text) => <PriceWithIcon price={text} />,
  },
];

// ? shoul we use /create route? (see second link in description): https://sudoswap.xyz/#/collections

export const Collections: FC = () => {
  return (
    <AppLayout>
      <Row justify="center">
        <Col>
          <Title>Collections</Title>
        </Col>
      </Row>

      <Row justify="center">
        <Col>
          <Title level={4}>
            Don&apos;t see a collection? Directly
            <Link to="/my-nfts"> list your NFTs</Link>, or create a new pool to
            buy and sell in bulk.
          </Title>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Table columns={columns} dataSource={data} pagination={false}></Table>
        </Col>
      </Row>
    </AppLayout>
  );
};
