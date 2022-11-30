import { PriceWithIcon } from '../PriceWithIcon';
import { Typography } from 'antd';
import { formatBNToString } from '../../utils';
import { BN } from 'hadeswap-sdk';
import { createPoolTableRow } from '../../state/core/helpers';
import { MarketInfo } from '../../state/core/types';
import { shortenAddress } from '../../utils/solanaUtils';

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

interface BaseItem {
  itemKey: string;
  nameKey: string;
  imageKey: string;
}

interface PoolItem extends BaseItem {
  list: PoolsList[];
}

interface CollectionItem extends BaseItem {
  list: CollectionList[];
}

const { Text } = Typography;

export const COLLECTION_ITEM: CollectionItem = {
  itemKey: 'marketPubkey',
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
  itemKey: 'pairPubkey',
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
