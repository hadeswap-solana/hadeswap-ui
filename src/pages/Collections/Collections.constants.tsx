import { Avatar, Col, Row, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { MarketInfo } from "../../state/core/types";
import { TitleWithInfo } from "./components/TitleWithInfo";
import { PriceWithIcon } from "./components/PriceWithIcon";
import { sortingValue } from "../../utils";

const { Text } = Typography;

export const UNTITLED_COLLECTION = 'untitled collection';
export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
}

export const COLUMNS: ColumnsType<MarketInfo> = [
  {
    key: 'collectionName',
    title: 'name',
    dataIndex: 'collectionName',
    sorter: (a, b) => sortingValue(a?.collectionName, b?.collectionName),
    showSorterTooltip: false,
    render: (text: string, record: MarketInfo): JSX.Element => (
      <Row align="middle" gutter={[8, 0]}>
        <Col>
          <Avatar src={record?.collectionImage} />
        </Col>
        <Col>{text || UNTITLED_COLLECTION}</Col>
      </Row>
    )
  },
  {
    key: 'listingsAmount',
    title: 'listings',
    dataIndex: 'listingsAmount',
    sorter: (a, b) => sortingValue(a?.listingsAmount, b?.listingsAmount),
    showSorterTooltip: false,
    render: (text) => <Text>{text}</Text>,
  },
  {
    key: 'floorPrice',
    title: (
      <TitleWithInfo
        title="floor price"
        infoText="price of the cheapest NFT listed best offer"
      />
    ),
    dataIndex: 'floorPrice',
    sorter: (a, b) => sortingValue(a?.floorPrice, b?.floorPrice),
    showSorterTooltip: false,
    render: (text) => <PriceWithIcon price={text} />,
  },
  {
    key: 'bestoffer',
    title: (
      <TitleWithInfo
        title="best offer"
        infoText="value of the highest collection offer offer TVL"
      />
    ),
    dataIndex: 'bestoffer',
    sorter: (a, b) => sortingValue(a?.bestoffer, b?.bestoffer),
    showSorterTooltip: false,
    render: (text) => <PriceWithIcon price={text} />,
  },
  {
    key: 'offerTVL',
    title: (
      <TitleWithInfo
        title="offer TVL"
        infoText="total amount of SOL locked in collection offers delta"
      />
    ),
    dataIndex: 'offerTVL',
    sorter: (a, b) => sortingValue(a?.offerTVL, b?.offerTVL),
    showSorterTooltip: false,
    defaultSortOrder: 'descend',
    render: (text) => <PriceWithIcon price={text} />,
  },
];