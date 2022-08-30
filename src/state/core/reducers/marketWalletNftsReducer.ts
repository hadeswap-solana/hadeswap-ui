import { createReducer } from 'typesafe-actions';
import { coreTypes } from '../actions/index';
import {
  createHandlers,
  createInitialAsyncState,
} from '../../../utils/state/reducers';

import { AsyncState } from '../../../utils/state';
import { Nft } from '../types';

export const initialWalletNftsState: AsyncState<Nft[]> =
  createInitialAsyncState<Nft[]>([]);

export const fetchMarketWalletNftsReducer = createReducer(
  initialWalletNftsState,
  createHandlers<Nft[]>(coreTypes.FETCH_MARKET_WALLET_NFTS),
);
