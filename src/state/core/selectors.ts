import { identity } from 'ramda';
import { createSelector } from 'reselect';
import { MarketInfo } from './types';

export const selectAllMarkets = createSelector(
  (store: any) => (store?.core?.markets?.markets?.data as MarketInfo[]) || [],
  identity,
);
