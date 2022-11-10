import { identity } from 'ramda';
import { createSelector } from 'reselect';
import { MarketInfo } from '../types';

export const selectCertainMarket = createSelector(
  (store: any) => (store?.core?.market?.data as MarketInfo) || null,
  identity<MarketInfo | null>,
);
