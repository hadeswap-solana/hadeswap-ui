import { ColumnsType } from 'antd/es/table';
import { Typography } from 'antd';
import { BN } from 'hadeswap-sdk';
import moment from 'moment/moment';
import { formatBNToString, specifyAndSort } from '../index';
import { PriceWithIcon } from '../../components/PriceWithIcon';
import { TitleWithInfo } from '../../components/TitleWithInfo';
import {
  TitleCell,
  ColoredTextCell,
  PriceCell,
  LinkCell,
} from '../../components/UI/TableComponents';
import { shortenAddress } from '../solanaUtils';
import {
  MarketInfo,
  OrderType,
  NftActivityData,
  NftTradeData,
} from '../../state/core/types';
import { createPoolTableRow } from '../../state/core/helpers';

const { Text } = Typography;

export const POOL_TABLE_COLUMNS: ColumnsType<
  ReturnType<typeof createPoolTableRow>
> = [
  {
    key: 'collectionName',
    title: 'collection',
    dataIndex: 'collectionName',
    sorter: (a, b) => a?.collectionName?.localeCompare(b?.collectionName),
    showSorterTooltip: false,
    render: (
      text: string,
      record: ReturnType<typeof createPoolTableRow>,
    ): JSX.Element => (
      <TitleCell imgSrc={record?.collectionImage} title={text} />
    ),
  },
  {
    key: 'type',
    title: 'pool type',
    dataIndex: 'type',
    sorter: (a, b) => a?.type.localeCompare(b?.type),
    showSorterTooltip: false,
    render: (text) => <Text>{text}</Text>,
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
    render: (text) => <Text>{text}%</Text>,
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
        <Text>--</Text>
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
      <Text>{record.type === 'nftForToken' ? '--' : text}</Text>
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
      <Text>{record.type === 'tokenForNft' ? '--' : text}</Text>
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
      <Text>
        {record.type === 'liquidity provision' ? (
          <PriceWithIcon price={formatBNToString(new BN(text || '0'))} />
        ) : (
          '--'
        )}
      </Text>
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
    render: (text) => <Text>{text}</Text>,
  },
  {
    key: 'ownerPublicKey',
    title: 'owner',
    dataIndex: 'ownerPublicKey',
    sorter: (a, b) => a?.ownerPublicKey.localeCompare(b?.ownerPublicKey),
    showSorterTooltip: false,
    render: (text: string) => <Text>{shortenAddress(text)}</Text>,
  },
];

export const COLLECTION_COLUMNS: ColumnsType<MarketInfo> = [
  {
    key: 'collectionName',
    title: 'name',
    dataIndex: 'collectionName',
    sorter: (a, b) => specifyAndSort(a?.collectionName, b?.collectionName),
    showSorterTooltip: false,
    render: (text: string, record: MarketInfo): JSX.Element => (
      <TitleCell imgSrc={record?.collectionImage} title={text} />
    ),
  },
  {
    key: 'listingsAmount',
    title: 'listings',
    dataIndex: 'listingsAmount',
    sorter: (a, b) => specifyAndSort(a?.listingsAmount, b?.listingsAmount),
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
    sorter: (a, b) => specifyAndSort(a?.floorPrice, b?.floorPrice),
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
    sorter: (a, b) => specifyAndSort(a?.bestoffer, b?.bestoffer),
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
    sorter: (a, b) => specifyAndSort(a?.offerTVL, b?.offerTVL),
    showSorterTooltip: false,
    defaultSortOrder: 'descend',
    render: (text) => <PriceWithIcon price={text} />,
  },
];

export const ACTIVITY_COLUMNS: ColumnsType<NftActivityData> = [
  {
    key: 'nftName',
    title: 'item',
    dataIndex: 'nftName',
    sorter: (a, b) => specifyAndSort(a?.nftName, b?.nftName),
    showSorterTooltip: false,
    defaultSortOrder: 'descend',
    render: (value, item) => (
      <LinkCell link={`https://solscan.io/token/${item.nftMint}`}>
        <TitleCell title={value} imgSrc={item.nftImageUrl} />
      </LinkCell>
    ),
  },
  {
    key: 'orderType',
    title: 'action',
    dataIndex: 'orderType',
    className: 'disabled-cell-hover',
    sorter: (a, b) => specifyAndSort(a?.orderType, b?.orderType),
    showSorterTooltip: false,
    defaultSortOrder: 'descend',
    render: (value) => (
      <ColoredTextCell cellValue={value} defaultValue={OrderType.BUY} />
    ),
  },
  {
    key: 'userTaker',
    title: 'user',
    dataIndex: 'userTaker',
    sorter: (a, b) => specifyAndSort(a?.userTaker, b?.userTaker),
    showSorterTooltip: false,
    defaultSortOrder: 'descend',
    render: (value, item) => (
      <LinkCell link={`https://solscan.io/account/${item.userTaker}`}>
        <Text>{shortenAddress(value)}</Text>
      </LinkCell>
    ),
  },
  {
    key: 'pair',
    title: 'pool',
    dataIndex: 'pair',
    sorter: (a, b) => specifyAndSort(a?.pair, b?.pair),
    showSorterTooltip: false,
    defaultSortOrder: 'descend',
    render: (value, item) => (
      <LinkCell link={`/pools/${item.pair}`} internal>
        <Text>{shortenAddress(value)}</Text>
      </LinkCell>
    ),
  },
  {
    key: 'solAmount',
    title: 'price',
    dataIndex: 'solAmount',
    className: 'disabled-cell-hover',
    sorter: (a, b) => specifyAndSort(a?.solAmount, b?.solAmount),
    showSorterTooltip: false,
    defaultSortOrder: 'descend',
    render: (value) => <PriceCell value={value} />,
  },
  {
    key: 'timestamp',
    title: 'when',
    dataIndex: 'timestamp',
    sorter: (a: NftActivityData, b: NftActivityData): number => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return specifyAndSort(dateA, dateB);
    },
    showSorterTooltip: false,
    defaultSortOrder: 'descend',
    render: (value, item) => (
      <LinkCell link={`https://solscan.io/tx/${item.signature}`}>
        <Text>{moment(value).fromNow()}</Text>
      </LinkCell>
    ),
  },
];

export const POOL_TRADE_COLUMNS: ColumnsType<NftTradeData> = [
  {
    key: 'nftName',
    title: 'item',
    dataIndex: 'nftName',
    sorter: (a, b) => specifyAndSort(a?.nftName, b?.nftName),
    showSorterTooltip: false,
    defaultSortOrder: 'descend',
    render: (value, item) => (
      <LinkCell link={`https://solscan.io/token/${item.nftMint}`}>
        <TitleCell title={value} imgSrc={item.nftImageUrl} />
      </LinkCell>
    ),
  },
  {
    key: 'orderType',
    title: 'action',
    dataIndex: 'orderType',
    className: 'disabled-cell-hover',
    sorter: (a, b) => specifyAndSort(a?.orderType, b?.orderType),
    showSorterTooltip: false,
    defaultSortOrder: 'descend',
    render: (value) => (
      <ColoredTextCell cellValue={value} defaultValue={OrderType.BUY} />
    ),
  },
  {
    key: 'userTaker',
    title: 'user',
    dataIndex: 'userTaker',
    sorter: (a, b) => specifyAndSort(a?.userTaker, b?.userTaker),
    showSorterTooltip: false,
    defaultSortOrder: 'descend',
    render: (value, item) => (
      <LinkCell link={`https://solscan.io/account/${item.userTaker}`}>
        <Text>{shortenAddress(value)}</Text>
      </LinkCell>
    ),
  },
  {
    key: 'solAmount',
    title: 'price',
    dataIndex: 'solAmount',
    className: 'disabled-cell-hover',
    sorter: (a, b) => specifyAndSort(a?.solAmount, b?.solAmount),
    showSorterTooltip: false,
    defaultSortOrder: 'descend',
    render: (value) => <PriceCell value={value} />,
  },
  {
    key: 'timestamp',
    title: 'when',
    dataIndex: 'timestamp',
    sorter: (a: NftTradeData, b: NftTradeData): number => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return specifyAndSort(dateA, dateB);
    },
    showSorterTooltip: false,
    defaultSortOrder: 'descend',
    render: (value, item) => (
      <LinkCell link={`https://solscan.io/tx/${item.signature}`}>
        <Text>{moment(value).fromNow()}</Text>
      </LinkCell>
    ),
  },
];
