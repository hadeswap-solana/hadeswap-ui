import { identity } from 'ramda';
import { createSelector } from 'reselect';
import { Pair } from '../types';
import { RequestStatus } from '../../../utils/state';

export const selectWalletPairs = createSelector(
  (store: any) => (store?.core?.walletPairs?.data as Pair[]) || [],
  identity<Pair[]>,
);

export const selectWalletPairsLoading = createSelector(
  (store: any) => (store?.core?.walletPairs?.status as RequestStatus) || '',
  (status: RequestStatus) => status === RequestStatus.PENDING,
);

export const selectWalletPair = createSelector(
  [selectWalletPairs, (_, pairPubkey: string) => pairPubkey],
  (pairs, pairPubkey) =>
    pairs?.find((pair) => pairPubkey === pair.pairPubkey) as Pair,
);
