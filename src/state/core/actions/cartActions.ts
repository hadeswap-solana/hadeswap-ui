import { createCustomAction } from 'typesafe-actions';

export const cartTypes = {
  ADD_BUY_ITEM: 'core/ADD_BUY_ITEM',
  ADD_SELL_TO_LIQUIDITY_ITEM: 'core/ADD_SELL_TO_LIQUIDITY_ITEM',
  ADD_SELL_TO_TOKEN_ITEM: 'core/ADD_SELL_TO_TOKEN_ITEM',
  REMOVE_BUY_ITEM: 'core/REMOVE_BUY_ITEM',
};

interface NftGeneral {
  mint: string;
  imageUrl: string;
  name: string;
  traits?: [string, string];
  collectionName?: string;
}

interface CartNft extends NftGeneral {
  assetReceiver: string;
  market?: string;
  spotPrice: number;
  bondingCurve: string;
  pair: string;
}

export interface SellOrder extends CartNft {
  vaultNftTokenAccount: string;
  nftPairBox: string;
  price: number;
  selected: boolean;
}

export interface BuyOrder extends CartNft {
  nftValidationAdapter: string;
}

export const cartActions = {
  addBuyItem: createCustomAction(cartTypes.ADD_BUY_ITEM, (nft: SellOrder) => ({
    payload: nft,
  })),
  removeBuyItem: createCustomAction(
    cartTypes.REMOVE_BUY_ITEM,
    (pair: string, mint: string) => ({
      payload: { pair, mint },
    }),
  ),
  addSellToLiquidityItem: createCustomAction(
    cartTypes.ADD_SELL_TO_LIQUIDITY_ITEM,
    (nft: BuyOrder) => ({
      payload: nft,
    }),
  ),
  addSellToTokenItem: createCustomAction(
    cartTypes.ADD_SELL_TO_TOKEN_ITEM,
    (nft: BuyOrder) => ({
      payload: nft,
    }),
  ),
};
