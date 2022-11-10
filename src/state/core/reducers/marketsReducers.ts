import { createInitialAsyncState, AsyncState } from '../../../utils/state';
import { createReducer } from 'typesafe-actions';
import { MarketInfo } from '../types';
import { coreTypes } from '../actions';

const initialCertainMarketState: AsyncState<MarketInfo> =
  createInitialAsyncState<MarketInfo>(null);

export const setCertainMarketReducer = createReducer(
  initialCertainMarketState,
  {
    [coreTypes.SET_MARKET]: (state, action) => ({
      ...state,
      data: action.payload,
    }),
  },
);
