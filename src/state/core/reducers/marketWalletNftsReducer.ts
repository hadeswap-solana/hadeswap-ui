import { createReducer } from 'typesafe-actions';
import { coreTypes } from '../actions';
import { createInitialAsyncState, AsyncState } from '../../../utils/state';
import { Nft } from '../types';

export const initialWalletNftsState: AsyncState<Nft[]> =
  createInitialAsyncState<Nft[]>([]);

export const setMarketWalletNftsReducer = createReducer(
  initialWalletNftsState,
  {
    [coreTypes.SET_MARKET_WALLET_NFTS]: (state, action) => ({
      ...state,
      data: action.payload,
    }),
  },
);
