import { createPoolTableRow } from '../../../state/core/helpers';
import { MarketInfo } from '../../../state/core/types';
import { SORT_ORDER } from '../../../constants/common';
import { specifyAndSort } from '../../../utils';

type SortProps = MarketInfo[] | ReturnType<typeof createPoolTableRow>[];

export const sortCollection = (
  collections: SortProps,
  sortValue: string,
  order: string,
): any[] => {
  const sorted = collections.sort((a, b) =>
    specifyAndSort(a[sortValue], b[sortValue]),
  );

  if (order === SORT_ORDER.DESC) {
    return sorted.reverse();
  }
  return sorted;
};
