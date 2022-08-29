import { coreTypes } from '../actions/index';
import {
  createHandlers,
  createInitialAsyncState,
} from '../../../utils/state/reducers';
import { createReducer } from 'typesafe-actions';
import { AsyncState } from '../../../utils/state';
import { Pair } from '../types';

const initialMarketPairsState: AsyncState<Pair[]> = createInitialAsyncState<
  Pair[]
>([]);

const initialPairState: AsyncState<Pair> = createInitialAsyncState<Pair>(null);

const initialWalletPairsState: AsyncState<Pair[]> = createInitialAsyncState<
  Pair[]
>([]);

export const fetchMarketPairsReducer = createReducer(
  initialMarketPairsState,
  createHandlers<Pair[]>(coreTypes.FETCH_MARKET_PAIRS),
);

export const fetchPairReducer = createReducer(
  initialPairState,
  createHandlers<Pair>(coreTypes.FETCH_PAIR),
);

export const fetchWalletPairsReducer = createReducer(
  initialWalletPairsState,
  createHandlers<Pair[]>(coreTypes.FETCH_WALLET_PAIRS),
);
