import { MarketInfo } from '../../state/core/types';

export const filterCollections = (
  collections: MarketInfo[],
  searchStr: string,
): MarketInfo[] =>
  collections.filter(({ collectionName }) =>
    collectionName?.toUpperCase()?.includes(searchStr),
  );
