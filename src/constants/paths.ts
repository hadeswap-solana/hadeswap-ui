// export enum COLLECTION_TABS {
//   BUY = 'buy',
//   SELL = 'sell',
//   ACTIVITY = 'activity',
//   POOLS = 'pools',
// }

// export const createCollectionLink = (
//   tab = COLLECTION_TABS.BUY,
//   publicKey = ':publicKey',
// ): string => `/collection/${publicKey}/${tab}`;
export const createCollectionLink = (
  //tab = COLLECTION_TABS.BUY,
  publicKey = ':publicKey',
): string => `/collection/${publicKey}`;

export const createCreatePollLink = (
  publicKey = ':publicKey?',
  type = ':type?',
): string => `/create-pool/${publicKey}/${type}`;

export const createCreatePoolPickSideLink = (
  publicKey = ':publicKey?',
): string => `/create-pool/${publicKey}`;

export const createEditPollLink = (poolPubkey = ':poolPubkey?'): string =>
  `/pools/${poolPubkey}/edit`;

export const PATHS = {
  ROOT: '/', //? Main page with common bullshit texts
  COLLECTIONS: '/collections', //? Collections table|list
  COLLECTION: createCollectionLink(), //? Collections table|list
  // COLLECTION_BUY: createCollectionLink(COLLECTION_TABS.BUY), //? Specific collection buy tab. Should be default tab if tab isn't specified
  // COLLECTION_SELL: createCollectionLink(COLLECTION_TABS.SELL), //? Specific collection sell tab.
  // COLLECTION_ACTIVITY: createCollectionLink(COLLECTION_TABS.ACTIVITY), //? Specific collection activity tab.
  // COLLECTION_POOLS: createCollectionLink(COLLECTION_TABS.POOLS), //? Specific collection pools tab.
  POOL_PAGE: '/pools/:poolPubkey', //? Specific pool page.
  POOL_EDIT: createEditPollLink(), //? Page to create pool.
  CREATE_POOL: createCreatePollLink(), //? Page to create pool.
  MY_NFTS: '/my-nfts', //? Show all user nfts
  MY_POOLS: '/my-pools', //? Show all user pools
  PAGE_404: '/404',
};
