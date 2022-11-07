import { coreTypes } from '../actions';
import {
  createHandlers,
  createInitialAsyncState,
  AsyncState,
} from '../../../utils/state';
import { createReducer } from 'typesafe-actions';
import { Pair } from '../types';

const initialMarketPairsState: AsyncState<Pair[]> = createInitialAsyncState<
  Pair[]
>([]);

const initialPairState: AsyncState<Pair> = createInitialAsyncState<Pair>(null);

export const fetchMarketPairsReducer = createReducer(
  initialMarketPairsState,
  createHandlers<Pair[]>(coreTypes.FETCH_MARKET_PAIRS),
);

export const fetchPairReducer = createReducer(
  initialPairState,
  createHandlers<Pair>(coreTypes.FETCH_PAIR),
);
