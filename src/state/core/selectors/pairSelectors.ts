import { RequestStatus } from '../../../utils/state';
import { identity } from 'ramda';
import { Pair } from '../types';
import { createSelector } from 'reselect';

export const selectCertainPair = createSelector(
  (store: any) => (store?.core?.pair?.data as Pair) || null,
  identity<Pair | null>,
);

export const selectCertainPairLoading = createSelector(
  (store: any) => (store?.core?.pair?.status as RequestStatus) || '',
  (status: RequestStatus) => status === RequestStatus.PENDING,
);
