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

export const setMarketPairsReducer = createReducer(initialMarketPairsState, {
  [coreTypes.SET_MARKET_PAIRS]: (state, action) => ({
    ...state,
    data: action.payload,
  }),
});

export const fetchPairReducer = createReducer(
  initialPairState,
  createHandlers<Pair>(coreTypes.FETCH_PAIR),
);
