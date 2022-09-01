import { Dictionary } from 'lodash';

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
  vaultTokenAccount: string;
  name: string;
  traits: [string, string];
}

export interface BasePair {
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
  buyOrdersAmount: number;
  market: string;
}

export interface Pair extends BasePair {
  sellOrders?: PairSellOrder[];
}

export interface CartPair extends Pair {
  takenMints: string[];
}

export enum OrderType {
  BUY = 'buy',
  SELL = 'sell',
}

export interface Nft {
  mint: string;
  imageUrl: string;
  name: string;
  traits?: [string, string];
  collectionName?: string;
  market?: string;
  nftPairBox?: string; //? Exists for Buy orders
  vaultTokenAccount?: string; //? Exists for Buy orders
  nftValidationAdapter?: string; //? Exists for Sell orders
}

export interface CartOrder extends Nft {
  type: OrderType;
  targetPairPukey: string;
  price: number;
}

export interface MarketOrder extends CartOrder {
  selected: boolean;
}

export type WalletNfts = Dictionary<{
  nfts: Nft[];
  pairs: Pair[];
}>;
