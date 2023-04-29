import {
  BondingCurveType,
  PairType,
} from 'hadeswap-sdk/lib/hadeswap-core/types';
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
  isPnft: boolean;
};

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
  type: PairType;
  fundsSolOrTokenBalance: number | null;
  nftsCount: number; // Sell orders
  // solOrTokenFeeAmount: number; //? Rewards
  bondingCurve: BondingCurveType;
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
  totalAccumulatedFees: number;
  sellOrders?: Nft[];
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

export interface PairSellOrder {
  disabled?: boolean;
  mint: string;
  imageUrl: string;
  nftPairBox: string;
  rarity?: NftRarity;
  vaultTokenAccount: string;
  name: string;
  traits: [string, string];
}

export interface NftRarity {
  howRareIs?: number;
  moonRank?: number;
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
  nftValidationAdapterV2?: string; //? Exists for Sell orders. Used for merkle tree validation
  validProof?: Buffer[]; //? Used for validation by merkle tree
  disabled?: boolean;
  rarity?: NftRarity;
}

export interface NftActivityData {
  nftImageUrl: string;
  nftMint: string;
  nftName: string;
  orderType: OrderType.BUY | OrderType.SELL;
  pair: string;
  pairType: string;
  signature: string;
  solAmount: number;
  timestamp: string;
  userMaker?: string;
  userTaker: string;
}

export interface NftTradeData {
  signature: string;
  orderType: string;
  pairType: string;
  nftMint: string;
  nftName: string;
  nftImageUrl: string;
  solAmount: number;
  userMaker: string;
  userTaker: string;
  market: string;
  timestamp: string;
}

export interface CartOrder extends Nft {
  type: OrderType;
  targetPairPukey: string;
  price: number;
  mathCounter: number;
}

export interface MarketOrder extends CartOrder {
  selected: boolean;
  isPNFT: boolean;
}

export type WalletNfts = Dictionary<{
  nfts: Nft[];
  pairs: Pair[];
}>;
