export enum IX_TYPE {
  CREATE_EMPTY_POOL,
  EDIT_POOL,

  ADD_OR_REMOVE_SOL_FROM_POOL, //? For tokenForNft only
  ADD_OR_REMOVE_NFT_FROM_POOL, //? For nftForToken only

  ADD_OR_REMOVE_LIQUIDITY_FROM_POOL, //? For liquidityProvision only

  REMOVE_BUY_ORDERS_FROM_POOL,

  COMPLETE_ORDER,
}
