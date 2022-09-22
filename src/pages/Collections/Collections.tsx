import { Typography, Row, Col, Table, Avatar } from 'antd';
import { FC, useEffect } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { Link, useHistory } from 'react-router-dom';
import { AppLayout } from '../../components/Layout/AppLayout';
import { PriceWithIcon } from './PriceWithIcon';
import { TitleWithInfo } from './TitleWithInfo';
import { COLLECTION_TABS, createCollectionLink } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { coreActions } from '../../state/core/actions';
import {
  selectAllMarkets,
  selectAllMarketsLoading,
} from '../../state/core/selectors';
import { MarketInfo } from '../../state/core/types';
import { Spinner } from '../../components/Spinner/Spinner';

const { Title, Text } = Typography;

const columns: ColumnsType<MarketInfo> = [
  {
    key: 'collectionName',
    title: 'name',
    dataIndex: 'collectionName',
    sorter: (a, b) => a?.collectionName.localeCompare(b?.collectionName),
    showSorterTooltip: false,
    render: (text, record) => {
      return (
        <Row align="middle" gutter={[8, 0]}>
          <Col>
            <Avatar src={record?.collectionImage} />
          </Col>
          <Col>{text || 'untitled collection'}</Col>
        </Row>
      );
    },
  },
  {
    key: 'listingsAmount',
    title: 'listings',
    dataIndex: 'listingsAmount',
    sorter: (a, b) => a?.listingsAmount - b?.listingsAmount,
    showSorterTooltip: false,
    render: (text) => <Text>{text}</Text>,
  },
  {
    key: 'floorPrice',
    title: (
      <TitleWithInfo
        title="floor Price"
        infoText="the price of the cheapset NFT lested."
      />
    ),
    dataIndex: 'floorPrice',
    sorter: (a, b) => parseFloat(a?.floorPrice) - parseFloat(b?.floorPrice),
    showSorterTooltip: false,
    render: (text) => <PriceWithIcon price={text} />,
  },
  {
    key: 'bestoffer',
    title: (
      <TitleWithInfo
        title="best Offer"
        infoText="the value of the highest collection offer."
      />
    ),
    dataIndex: 'bestoffer',
    sorter: (a, b) => parseFloat(a?.bestoffer) - parseFloat(b?.bestoffer),
    showSorterTooltip: false,
    render: (text) => <PriceWithIcon price={text} />,
  },
  {
    key: 'offerTVL',
    title: (
      <TitleWithInfo
        title="offer TVL"
        infoText="the total amount of sol locked in collection offers."
      />
    ),
    dataIndex: 'offerTVL',
    sorter: (a, b) => parseFloat(a?.offerTVL) - parseFloat(b?.offerTVL),
    showSorterTooltip: false,
    render: (text) => <PriceWithIcon price={text} />,
  },
];

export const Collections: FC = () => {
  const history = useHistory();

  const dispatch = useDispatch();

  const collectionsLoading = useSelector(selectAllMarketsLoading);

  useEffect(() => {
    dispatch(coreActions.fetchAllMarkets());
  }, [dispatch]);

  const markets = useSelector(selectAllMarkets) as MarketInfo[];

  return (
    <AppLayout>
      <Row justify="center">
        <Col>
          <Title>collections</Title>
        </Col>
      </Row>
      {collectionsLoading ? (
        <Spinner />
      ) : (
        <>
          {' '}
          <Row justify="center">
            <Col>
              <Title level={4}>
                don&apos;t see a collection? Directly
                <Link to="/my-nfts"> list your nfts</Link>, or create a new pool
                to buy and sell in bulk.
              </Title>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Table
                columns={columns}
                dataSource={markets}
                pagination={false}
                style={{ cursor: 'pointer' }}
                rowKey={(record) => record.marketPubkey}
                onRow={({ marketPubkey }) => {
                  return {
                    onClick: () => {
                      history.push(
                        createCollectionLink(COLLECTION_TABS.BUY, marketPubkey),
                      );
                      window.scrollTo(0, 0);
                    },
                  };
                }}
              />
            </Col>
          </Row>
        </>
      )}
    </AppLayout>
  );
};
