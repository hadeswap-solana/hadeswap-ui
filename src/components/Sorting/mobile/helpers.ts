import { createPoolTableRow } from '../../../state/core/helpers';
import { MarketInfo } from '../../../state/core/types';
import { SORT_ORDER } from '../../../constants/common';
import { specifyAndSort } from '../../../utils';

type Collections = ReturnType<typeof createPoolTableRow>[] | MarketInfo[];

export const sortCollection = (
  collections: Collections,
  sortValue: string,
  order: string,
): Collections => {
  const sorted = collections.sort((a, b) =>
    specifyAndSort(a[sortValue], b[sortValue]),
  );

  if (order === SORT_ORDER.DESC) {
    return sorted.reverse();
  }
  return sorted;
};
