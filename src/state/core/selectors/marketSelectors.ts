import { identity } from 'ramda';
import { createSelector } from 'reselect';
import { MarketInfo } from '../types';

export const selectCertainMarket = createSelector(
  (store: any) => (store?.core?.market?.data as MarketInfo) || null,
  identity<MarketInfo | null>,
);

export const selectCertainMarketLoading = createSelector(
  (store: any) => store?.core?.market?.isLoading,
  identity<boolean>,
);

export const selectAllMarkets = createSelector(
  (store: any) => (store?.core?.allMarkets?.data as MarketInfo[]) || [],
  identity<MarketInfo[]>,
);

export const selectAllMarketsLoading = createSelector(
  (store: any) => store?.core?.allMarkets?.isLoading,
  identity<boolean>,
);
