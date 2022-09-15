import { identity } from 'ramda';
import { createSelector } from 'reselect';
import { Nft } from '../types';

export const selectAllWalletNfts = createSelector(
  (store: any) => (store?.core?.walletNfts?.data as Nft[]) || [],
  identity<Nft[]>,
);
