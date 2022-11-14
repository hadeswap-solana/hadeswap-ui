import { coreTypes } from '../actions';
import { createInitialAsyncState, AsyncState } from '../../../utils/state';
import { createReducer } from 'typesafe-actions';
import { Pair } from '../types';

const initialMarketPairsState: AsyncState<Pair[]> = createInitialAsyncState<
  Pair[]
>([]);
const initialPairState: AsyncState<Pair> = createInitialAsyncState<Pair>(null);
const initialWalletPairsState: AsyncState<Pair[]> = createInitialAsyncState<
  Pair[]
>([]);

export const setMarketPairsReducer = createReducer(initialMarketPairsState, {
  [coreTypes.SET_MARKET_PAIRS]: (state, { payload }) => ({
    ...state,
    data: payload.data,
    isLoading: payload.isLoading,
  }),
});

export const setPairReducer = createReducer(initialPairState, {
  [coreTypes.SET_PAIR]: (state, { payload }) => ({
    ...state,
    data: payload.data,
    isLoading: payload.isLoading,
  }),
});

export const setWalletPairsReducer = createReducer(initialWalletPairsState, {
  [coreTypes.SET_WALLET_PAIRS]: (state, { payload }) => ({
    ...state,
    data: payload.data,
    isLoading: payload.isLoading,
  }),
});
