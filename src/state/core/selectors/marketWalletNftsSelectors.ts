import { identity } from 'ramda';
import { createSelector } from 'reselect';
import { Nft } from '../types';
import { RequestStatus } from '../../../utils/state';

export const selectMarketWalletNfts = createSelector(
  (store: any) => (store?.core?.marketWalletNfts?.data as Nft[]) || [],
  identity<Nft[]>,
);

export const selectMarketWalletNftsLoading = createSelector(
  (store: any) =>
    (store?.core?.marketWalletNfts?.status as RequestStatus) || '',
  (status: RequestStatus) => status === RequestStatus.PENDING,
);
