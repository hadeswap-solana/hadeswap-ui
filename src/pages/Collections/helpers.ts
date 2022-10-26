import { specifyAndSort } from '../../utils';
import { MarketInfo } from '../../state/core/types';
import { SORT_ORDER } from '../../constants/common';

export const sortCollection = (
  collections: MarketInfo[],
  sortValue: string,
  order: string,
): MarketInfo[] => {
  const sorted = collections.sort((a, b) =>
    specifyAndSort(a[sortValue], b[sortValue]),
  );

  if (order === SORT_ORDER.DESC) {
    return sorted.reverse();
  }
  return sorted;
};

export const filterCollections = (
  collections: MarketInfo[],
  searchStr: string,
): MarketInfo[] =>
  collections.filter(({ collectionName }) =>
    collectionName?.toUpperCase()?.includes(searchStr),
  );
