import { Typography, Row, Col, Table, Avatar, Button, Input } from 'antd';
import { FC, useEffect, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { useHistory } from 'react-router-dom';
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
import { SearchOutlined } from '@ant-design/icons';
import styles from './Collections.module.scss';
import { useDebounce } from '../../hooks';

const { Title, Text } = Typography;

const columns: ColumnsType<MarketInfo> = [
  {
    key: 'collectionName',
    title: 'name',
    dataIndex: 'collectionName',
    sorter: (a, b) => a?.collectionName?.localeCompare(b?.collectionName),
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
        title="floor price"
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
        title="best offer"
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
    defaultSortOrder: 'descend',
    render: (text) => <PriceWithIcon price={text} />,
  },
];

export const Collections: FC = () => {
  const history = useHistory();
  const [searchStr, setSearchStr] = useState('');

  const setSearch = useDebounce((search: string) => {
    setSearchStr(search.toUpperCase());
  }, 300);

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
          <Row justify="center">
            <Col>
              <Button
                style={{ marginBottom: '20px' }}
                type="primary"
                size="large"
                onClick={() => {
                  history.push('/create-pool');
                }}
              >
                + create pool
              </Button>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <div className={styles.tableWrapper}>
                <Input
                  size="large"
                  placeholder="Search by collection name"
                  prefix={<SearchOutlined />}
                  className={styles.searchInput}
                  onChange={(event) => setSearch(event.target.value || '')}
                />
                <Table
                  className={styles.table}
                  columns={columns}
                  dataSource={markets.filter(({ collectionName }) =>
                    collectionName?.toUpperCase()?.includes(searchStr),
                  )}
                  pagination={false}
                  rowKey={(record) => record.marketPubkey}
                  onRow={({ marketPubkey }) => {
                    return {
                      onClick: () => {
                        history.push(
                          createCollectionLink(
                            COLLECTION_TABS.BUY,
                            marketPubkey,
                          ),
                        );
                        window.scrollTo(0, 0);
                      },
                    };
                  }}
                />
              </div>
            </Col>
          </Row>
        </>
      )}
    </AppLayout>
  );
};
