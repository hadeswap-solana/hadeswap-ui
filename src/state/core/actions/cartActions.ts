import { createCustomAction } from 'typesafe-actions';

export const cartTypes = {
  ADD_BUY_ITEM: 'core/ADD_BUY_ITEM',
  REMOVE_BUY_ITEM: 'core/REMOVE_BUY_ITEM',
  ADD_SELL_ITEM: 'core/ADD_SELL_ITEM',
  REMOVE_SELL_ITEM: 'core/REMOVE_SELL_ITEM',
};

interface NftGeneral {
  mint: string;
  imageUrl: string;
  name: string;
  traits?: [string, string];
  collectionName?: string;
}

export interface CartNft extends NftGeneral {
  assetReceiver: string;
  market?: string;
  spotPrice: number;
  bondingCurve: string;
  pair: string;
  selected: boolean;
  price: number;
  type: string;
}

export interface SellOrder extends CartNft {
  vaultNftTokenAccount: string;
  nftPairBox: string;
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
  addSellItem: createCustomAction(cartTypes.ADD_SELL_ITEM, (nft: BuyOrder) => ({
    payload: nft,
  })),
  removeSellItem: createCustomAction(
    cartTypes.REMOVE_SELL_ITEM,
    (pair: string, mint: string) => ({
      payload: { pair, mint },
    }),
  ),
};
