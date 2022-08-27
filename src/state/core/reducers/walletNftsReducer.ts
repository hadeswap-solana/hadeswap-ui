import { createReducer } from 'typesafe-actions';

import { coreTypes } from './../actions/index';
import {
  composeReducers,
  createHandlers,
  createInitialAsyncState,
} from './../../../utils/state/reducers';

import { AsyncState } from '../../../utils/state';
import { WalletNft } from '../types';

export const initialWalletNftsState: AsyncState<WalletNft[]> =
  createInitialAsyncState<WalletNft[]>([]);

const fetchWalletNftsReducer = createReducer(
  initialWalletNftsState,
  createHandlers<WalletNft[]>(coreTypes.FETCH_WALLET_NFTS),
);

export const walletNftsReducer = composeReducers(fetchWalletNftsReducer);
