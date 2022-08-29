export type WalletNft = {
  mint: string;
  imageUrl: string;
  name: string;
  traits: [string, string];
  collectionName: string;
  market: string;
  nftValidationAdapter: string;
  pairs: Pair[]; //? buy || liquidity
};

export type MarketInfo = {
  marketPubkey: string;
  collectionName: string;
  collectionImage: string;

  listingsAmount: number;
  floorPrice: string;
  bestoffer: string;
  offerTVL: string;
  nftValidationAdapter: string;
};

export interface PairSellOrder {
  mint: string;
  imageUrl: string;
  nftPairBox: string;
  vaultNftTokenAccount: string;
  name: string;
  traits: [string, string];
}

export interface Pair {
  pairPubkey: string;
  type: string;
  fundsSolOrTokenBalance: number | null;
  nftsCount: number;
  bondingCurve: string;
  delta: number;
  assetReceiver: string;
  pairState: string;
  spotPrice: number; //? For sell: Real price for sell order is sum of spotPrice+delta(spotPrice*delta) For buy: Real price
  fee: number;
  sellOrders: PairSellOrder[];
  buyOrdersAmount: number;
}
