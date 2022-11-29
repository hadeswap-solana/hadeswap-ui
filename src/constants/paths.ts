export const createCollectionLink = (publicKey = ':publicKey'): string =>
  `/collection/${publicKey}`;

export const createCreatePoolPickSideLink = (
  publicKey = ':publicKey?',
): string => `/create-pool/${publicKey}`;

export const createEditPoollLink = (poolPubkey = ':poolPubkey?'): string =>
  `/pools/${poolPubkey}/edit`;

export const PATHS = {
  ROOT: '/', //? Main page with common bullshit texts
  COLLECTIONS: '/collections', //? Collections table|list
  COLLECTION: createCollectionLink(), //? Collections table|list
  POOL_PAGE: '/pools/:poolPubkey', //? Specific pool page.
  POOL_EDIT: createEditPoollLink(), //? Page to create pool.
  CREATE_POOL: '/create-pool/:publicKey?/:type?',
  MY_NFTS: '/my-nfts', //? Show all user nfts
  MY_POOLS: '/my-pools', //? Show all user pools
  PAGE_404: '/404',
};
