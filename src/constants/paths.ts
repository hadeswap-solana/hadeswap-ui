export const createCollectionLink = (publicKey = ':publicKey'): string =>
  `/collection/${publicKey}`;

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
  POOL_PAGE: '/pools/:poolPubkey', //? Specific pool page.
  POOL_EDIT: createEditPollLink(), //? Page to create pool.
  CREATE_POOL: createCreatePollLink(), //? Page to create pool.
  MY_NFTS: '/my-nfts', //? Show all user nfts
  MY_POOLS: '/my-pools', //? Show all user pools
  PAGE_404: '/404',
};
