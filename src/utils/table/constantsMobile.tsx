import { BN } from 'hadeswap-sdk';
import { Typography } from 'antd';
import { formatBNToString } from '../index';
import { PubKeys } from '../../constants/common';
import { shortenAddress } from '../solanaUtils';
import { PriceWithIcon } from '../../components/PriceWithIcon';
import {
  ColoredTextCell,
  LinkCell,
  PriceCell,
} from '../../components/UI/table';
import { MarketInfo, NftActivityData } from '../../state/core/types';
import { createPoolTableRow } from '../../state/core/helpers';
import moment from 'moment';

interface BaseItem {
  itemKey: string;
  nameKey: string;
  imageKey: string;
}

interface BaseList {
  title: string;
  valueKey: string;
}

interface PoolsList extends BaseList {
  render: (
    value: number | string,
    item: ReturnType<typeof createPoolTableRow>,
  ) => JSX.Element;
}

interface CollectionList extends BaseList {
  render: (value: number | string, item: MarketInfo) => JSX.Element;
}

interface ActivityList extends BaseList {
  render: (value: number | string, item: NftActivityData) => JSX.Element;
}

interface PoolItem extends BaseItem {
  list: PoolsList[];
}

interface CollectionItem extends BaseItem {
  list: CollectionList[];
}

interface ActivityItem extends BaseItem {
  list: ActivityList[];
}

const { Text } = Typography;

export const COLLECTION_ITEM: CollectionItem = {
  itemKey: PubKeys.MARKET_PUBKEY,
  nameKey: 'collectionName',
  imageKey: 'collectionImage',
  list: [
    {
      title: 'listings',
      valueKey: 'listingsAmount',
      render: (value: number) => <Text>{value}</Text>,
    },
    {
      title: 'floor price',
      valueKey: 'floorPrice',
      render: (value: string) => <PriceWithIcon price={value} />,
    },
    {
      title: 'best offer',
      valueKey: 'bestoffer',
      render: (value: string) => <PriceWithIcon price={value} />,
    },
    {
      title: 'offer TVL',
      valueKey: 'offerTVL',
      render: (value: string) => <PriceWithIcon price={value} />,
    },
  ],
};

export const POOL_ITEM: PoolItem = {
  itemKey: PubKeys.PAIR_PUBKEY,
  nameKey: 'collectionName',
  imageKey: 'collectionImage',
  list: [
    {
      title: 'pool type',
      valueKey: 'type',
      render: (value: string) => <Text>{value}</Text>,
    },
    {
      title: 'spot price',
      valueKey: 'spotPrice',
      render: (value: string) => <PriceWithIcon price={value} />,
    },
    {
      title: 'fee',
      valueKey: 'fee',
      render: (value: number) => <Text>{value}%</Text>,
    },
    {
      title: 'SOL balance',
      valueKey: 'fundsSolOrTokenBalance',
      render: (value: string, item) => (
        <>
          {item.type === 'nftForToken' ? (
            <Text>--</Text>
          ) : (
            <PriceWithIcon price={value} />
          )}
        </>
      ),
    },
    {
      title: 'buy orders',
      valueKey: 'buyOrdersAmount',
      render: (value: number, item) => (
        <Text>{item.type === 'nftForToken' ? '--' : value}</Text>
      ),
    },
    {
      title: 'sell orders',
      valueKey: 'sellOrdersAmount',
      render: (value: number, item) => (
        <Text>{item.type === 'tokenForNft' ? '--' : value}</Text>
      ),
    },
    {
      title: 'accumulated fees',
      valueKey: 'totalAccumulatedFees',
      render: (value: number, item) => (
        <>
          {item.type === 'liquidity provision' ? (
            <PriceWithIcon price={formatBNToString(new BN(value || '0'))} />
          ) : (
            <Text>--</Text>
          )}
        </>
      ),
    },
    {
      title: 'delta',
      valueKey: 'delta',
      render: (value: string) => <Text>{value}</Text>,
    },
    {
      title: 'owner',
      valueKey: 'ownerPublicKey',
      render: (value: string) => <Text>{shortenAddress(value)}</Text>,
    },
  ],
};

export const ACTIVITY_ITEM: ActivityItem = {
  itemKey: PubKeys.NFT_MINT,
  nameKey: 'nftName',
  imageKey: 'nftImageUrl',
  list: [
    {
      title: 'action',
      valueKey: 'orderType',
      render: (value: string) => (
        <ColoredTextCell cellValue={value} defaultValue="buy" />
      ),
    },
    {
      title: 'user',
      valueKey: 'userTaker',
      render: (value: string, item) => (
        <LinkCell link={`https://solscan.io/account/${item.userTaker}`}>
          <Text>{shortenAddress(value)}</Text>
        </LinkCell>
      ),
    },
    {
      title: 'pool',
      valueKey: 'pair',
      render: (value: string, item) => (
        <LinkCell link={`/pools/${item.pair}`} internal>
          <Text>{shortenAddress(value)}</Text>
        </LinkCell>
      ),
    },
    {
      title: 'price',
      valueKey: 'solAmount',
      render: (value: number) => <PriceCell value={String(value)} />,
    },
    {
      title: 'when',
      valueKey: 'timestamp',
      render: (value: string, item) => (
        <LinkCell link={`https://solscan.io/tx/${item.signature}`}>
          <Text>{moment(value).fromNow()}</Text>
        </LinkCell>
      ),
    },
  ],
};
