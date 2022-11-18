import { createInitialAsyncState, AsyncState } from '../../../utils/state';
import { createReducer } from 'typesafe-actions';
import { MarketInfo } from '../types';
import { coreTypes } from '../actions';

const initialCertainMarketState: AsyncState<MarketInfo> =
  createInitialAsyncState<MarketInfo>(null);
const initialAllMarketsState: AsyncState<MarketInfo[]> =
  createInitialAsyncState<MarketInfo[]>([]);

export const setCertainMarketReducer = createReducer(
  initialCertainMarketState,
  {
    [coreTypes.SET_MARKET]: (state, { payload }) => ({
      ...state,
      data: payload.data,
      isLoading: payload.isLoading,
    }),
  },
);

export const setAllMarketsReducer = createReducer(initialAllMarketsState, {
  [coreTypes.SET_ALL_MARKETS]: (state, { payload }) => ({
    ...state,
    data: payload.data,
    isLoading: payload.isLoading,
  }),
});
