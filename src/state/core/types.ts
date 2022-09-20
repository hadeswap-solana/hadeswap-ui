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

export enum LpOrderState {
  virtual = 'virtual',
  tokenized = 'tokenized',
  withdrawnVirtual = 'withdrawnVirtual',
  withdrawnTokenized = 'withdrawnTokenized',
}

export interface ProvisionOrders {
  ftSwapPair: string;
  lpOrderState: LpOrderState;
  orderACounter: number;
  orderBCounter: number;
  accumulatedFee: number;
  lpTokenMint: string;
  liquidityFeeBump: number;
  createdAt: number;
  liquidityProvisionOrder: string;
}

export interface BasePair {
  pairPubkey: string;
  type: string;
  fundsSolOrTokenBalance: number | null;
  nftsCount: number; // Sell orders
  // solOrTokenFeeAmount: number; //? Rewards
  bondingCurve: string;
  delta: number;
  assetReceiver: string;
  pairState: string;
  currentSpotPrice: number; //? For sell: Real price for makerSell order is sum of spotPrice+delta(spotPrice*delta) For makerBuy: Real price
  baseSpotPrice: number;
  mathCounter: number;
  fee: number;
  buyOrdersAmount: number; // Buy orders
  market: string;
  authorityAdapterPubkey: string;
}

export interface Pair extends BasePair {
  sellOrders?: PairSellOrder[];
  liquidityProvisionOrders: ProvisionOrders[];
}

export interface PairUpdate extends BasePair {
  sellOrdersMints?: string[];
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
  mathCounter: number;
}

export interface MarketOrder extends CartOrder {
  selected: boolean;
}

export type WalletNfts = Dictionary<{
  nfts: Nft[];
  pairs: Pair[];
}>;
