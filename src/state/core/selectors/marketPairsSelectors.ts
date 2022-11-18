import { identity } from 'ramda';
import { createSelector } from 'reselect';
import { Pair } from '../types';
import { convertCartPairToMarketPair } from '../helpers';
import { selectCartPairs } from './cartSelectors';

export const selectRawMarketPairs = createSelector(
  (store: any) => (store?.core?.marketPairs?.data as Pair[]) || [],
  identity<Pair[]>,
);

export const selectMarketPairsLoading = createSelector(
  (store: any) => store?.core?.marketPairs?.isLoading,
  identity<boolean>,
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
