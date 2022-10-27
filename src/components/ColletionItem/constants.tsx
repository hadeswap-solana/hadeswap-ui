export const OWNER_PUBLIC_KEY = 'ownerPublicKey';

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
      title: 'LISTINGS',
      valueKey: 'listingsAmount',
    },
    {
      title: 'FLOOR PRICE',
      valueKey: 'floorPrice',
      price: true,
    },
    {
      title: 'BEST OFFER',
      valueKey: 'bestoffer',
      price: true,
    },
    {
      title: 'OFFER TVL',
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
      title: 'POOL TYPE',
      valueKey: 'type',
    },
    {
      title: 'SPOT PRICE',
      valueKey: 'spotPrice',
      price: true,
    },
    {
      title: 'FEE',
      valueKey: 'fee',
      percent: true,
    },
    {
      title: 'SOL BALANCE',
      valueKey: 'fundsSolOrTokenBalance',
      price: true,
    },
    {
      title: 'BUY ORDERS',
      valueKey: 'buyOrdersAmount',
    },
    {
      title: 'SELL ORDERS',
      valueKey: 'sellOrdersAmount',
    },
    {
      title: 'ACCUMULATED FEES',
      valueKey: 'totalAccumulatedFees',
      price: true,
    },
    {
      title: 'DELTA',
      valueKey: 'delta',
    },
    {
      title: 'OWNER',
      valueKey: OWNER_PUBLIC_KEY,
    },
  ],
};
