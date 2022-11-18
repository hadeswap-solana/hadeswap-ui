import { identity } from 'ramda';
import { createSelector } from 'reselect';
import { Nft } from '../types';

export const selectMarketWalletNfts = createSelector(
  (store: any) => (store?.core?.marketWalletNfts?.data as Nft[]) || [],
  identity<Nft[]>,
);

export const selectMarketWalletNftsLoading = createSelector(
  (store: any) => store?.core?.marketWalletNfts?.isLoading,
  identity<boolean>,
);
