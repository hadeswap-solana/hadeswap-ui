import { identity } from 'ramda';
import { createSelector } from 'reselect';
import { Pair } from '../types';
import { convertCartPairToMarketPair } from '../helpers';
import { RequestStatus } from '../../../utils/state';
import { selectCartPairs } from './cartSelectors';

export const selectRawMarketPairs = createSelector(
  (store: any) => (store?.core?.marketPairs?.data as Pair[]) || [],
  identity<Pair[]>,
);

export const selectMarketPairs = createSelector(
  [selectCartPairs, selectRawMarketPairs],
  (cartPairs, rawMarketPairs): Pair[] => {
    return rawMarketPairs.map((rawPair) => {
      const cartPair = cartPairs[rawPair.pairPubkey];
      return cartPair ? convertCartPairToMarketPair(cartPair) : rawPair;
    });
  },
);

export const selectMarketPairsLoading = createSelector(
  (store: any) => (store?.core?.marketPairs?.status as RequestStatus) || '',
  (status: RequestStatus) => status === RequestStatus.PENDING,
);
