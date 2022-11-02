import { createPoolTableRow } from '../../state/core/helpers';
import { keyBy } from 'lodash';
import { Pair, MarketInfo } from '../../state/core/types';

export const combineMyPoolsPageTableInfo = (
  markets: MarketInfo[],
  pairs: Pair[],
): Array<ReturnType<typeof combineMyPoolsPageTableInfo>> => {
  const marketByPubkey = keyBy(markets, 'marketPubkey');

  return pairs.map((pair) => {
    return createPoolTableRow(pair, marketByPubkey[pair.market]);
  });
};
