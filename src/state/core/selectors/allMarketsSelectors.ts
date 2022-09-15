import { identity } from 'ramda';
import { createSelector } from 'reselect';
import { MarketInfo } from '../types';
import { RequestStatus } from '../../../utils/state';

export const selectAllMarkets = createSelector(
  (store: any) => (store?.core?.markets?.data as MarketInfo[]) || [],
  identity<MarketInfo[]>,
);

export const selectAllMarketsLoading = createSelector(
  (store: any) => (store?.core?.markets?.status as RequestStatus) || '',
  (status: RequestStatus) => status === RequestStatus.PENDING,
);
