import { createCustomAction } from 'typesafe-actions';
import { Nft } from '../types';

export const marketWalletNftsTypes = {
  SET_MARKET_WALLET_NFTS: 'core/SET_MARKET_WALLET_NFTS',
};

export const marketWalletNftsActions = {
  setMarketWalletNfts: createCustomAction(
    marketWalletNftsTypes.SET_MARKET_WALLET_NFTS,
    (data: Nft[]) => ({ payload: data }),
  ),
};
