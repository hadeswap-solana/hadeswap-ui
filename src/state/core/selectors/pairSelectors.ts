import { identity } from 'ramda';
import { Pair } from '../types';
import { createSelector } from 'reselect';

export const selectCertainPair = createSelector(
  (store: any) => (store?.core?.pair?.data as Pair) || null,
  identity<Pair | null>,
);

export const selectCertainPairLoading = createSelector(
  (store: any) => store?.core?.pair?.isLoading,
  identity<boolean>,
);

export const selectWalletPairs = createSelector(
  (store: any) => (store?.core?.walletPairs?.data as Pair[]) || [],
  identity<Pair[]>,
);

export const selectWalletPairsLoading = createSelector(
  (store: any) => store?.core?.walletPairs?.isLoading,
  identity<boolean>,
);
