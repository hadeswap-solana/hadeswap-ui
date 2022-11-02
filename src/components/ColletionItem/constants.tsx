export const OWNER_PUBLIC_KEY = 'ownerPublicKey';
export const TOTAL_ACCUMULATED_FEES = 'totalAccumulatedFees';

interface List {
  title: string;
  valueKey: string;
  price?: boolean;
  percent?: boolean;
}

interface Item {
  itemKey: string;
  nameKey: string;
  imageKey: string;
  list: List[];
}

export const COLLECTION_ITEM: Item = {
  itemKey: 'marketPubkey',
  nameKey: 'collectionName',
  imageKey: 'collectionImage',
  list: [
    {
      title: 'listings',
      valueKey: 'listingsAmount',
    },
    {
      title: 'floor price',
      valueKey: 'floorPrice',
      price: true,
    },
    {
      title: 'best offer',
      valueKey: 'bestoffer',
      price: true,
    },
    {
      title: 'offer TVL',
      valueKey: 'offerTVL',
      price: true,
    },
  ],
};

export const POOL_ITEM: Item = {
  itemKey: 'pairPubkey',
  nameKey: 'collectionName',
  imageKey: 'collectionImage',
  list: [
    {
      title: 'pool type',
      valueKey: 'type',
    },
    {
      title: 'spot price',
      valueKey: 'spotPrice',
      price: true,
    },
    {
      title: 'fee',
      valueKey: 'fee',
      percent: true,
    },
    {
      title: 'SOL balance',
      valueKey: 'fundsSolOrTokenBalance',
      price: true,
    },
    {
      title: 'buy orders',
      valueKey: 'buyOrdersAmount',
    },
    {
      title: 'sell orders',
      valueKey: 'sellOrdersAmount',
    },
    {
      title: 'accumulated fees',
      valueKey: TOTAL_ACCUMULATED_FEES,
      price: true,
    },
    {
      title: 'delta',
      valueKey: 'delta',
    },
    {
      title: 'owner',
      valueKey: OWNER_PUBLIC_KEY,
    },
  ],
};
