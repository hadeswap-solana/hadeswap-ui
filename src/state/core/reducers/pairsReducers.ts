import { coreTypes } from '../actions';
import { createInitialAsyncState, AsyncState } from '../../../utils/state';
import { createReducer } from 'typesafe-actions';
import { Pair } from '../types';

const initialMarketPairsState: AsyncState<Pair[]> = createInitialAsyncState<
  Pair[]
>([]);

export const setMarketPairsReducer = createReducer(initialMarketPairsState, {
  [coreTypes.SET_MARKET_PAIRS]: (state, action) => ({
    ...state,
    data: action.payload,
  }),
});
