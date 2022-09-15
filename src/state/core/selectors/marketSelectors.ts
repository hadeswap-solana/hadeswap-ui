import { identity } from 'ramda';
import { createSelector } from 'reselect';
import { MarketInfo } from '../types';
import { RequestStatus } from '../../../utils/state';

export const selectCertainMarket = createSelector(
  (store: any) => (store?.core?.market?.data as MarketInfo) || null,
  identity<MarketInfo | null>,
);

export const selectCertainMarketLoading = createSelector(
  (store: any) => (store?.core?.market?.status as RequestStatus) || '',
  (status: RequestStatus) => status === RequestStatus.PENDING,
);
