import { web3 } from '@project-serum/anchor';

export type WalletNft = {
  mint: web3.PublicKey;
  imageUrl: string;
  name: string;
  traits: [string, string];
  collectionName: string;
  market: web3.PublicKey;
  nftValidationAdapter: web3.PublicKey;
  pairs: Pair[]; //? buy || liquidity
};

export type MarketInfo = {
  marketPubkey: web3.PublicKey;
  collectionName: string;
  collectionImage: string;

  listingsAmount: number;
  floorPrice: string;
  bestoffer: string;
  offerTVL: string;
  nftValidationAdapter: web3.PublicKey;
};

export interface MarketPair {
  pairPubkey: web3.PublicKey;
  type: string;
  fundsSolOrTokenBalance: string | null;
  nftsCount: number;
  bondingCurve: string;
  delta: number;
  assetReceiver: web3.PublicKey;
  pairState: string;
  spotPrice: number; //? For sell: Real price for sell order is sum of spotPrice+delta(spotPrice*delta) For buy: Real price
  fee: number;
}

export type PairSellOrder = {
  mint: web3.PublicKey;
  imageUrl: string;
  nftPairBox: web3.PublicKey;
  vaultNftTokenAccount: web3.PublicKey;
  name: string;
  traits: [string, string];
};

export interface Pair extends MarketPair {
  sellOrders: PairSellOrder[];
  buyOrdersAmount: number;
}
