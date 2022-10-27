import { createPoolTableRow } from '../../../state/core/helpers';
import { MarketInfo } from '../../../state/core/types';
import { SORT_ORDER } from '../../../constants/common';
import { specifyAndSort } from '../../../utils';

export const sortCollection = (
  collections: ReturnType<typeof createPoolTableRow>[] | MarketInfo[],
  sortValue: string,
  order: string,
): ReturnType<typeof createPoolTableRow>[] | MarketInfo[] => {
  const sorted = collections.sort((a, b) =>
    specifyAndSort(a[sortValue], b[sortValue]),
  );

  if (order === SORT_ORDER.DESC) {
    return sorted.reverse();
  }
  return sorted;
};
