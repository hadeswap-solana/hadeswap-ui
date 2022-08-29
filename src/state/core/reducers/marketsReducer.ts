import { combineReducers } from 'redux';
import {
  createHandlers,
  createInitialAsyncState,
} from './../../../utils/state/reducers';
import { createReducer } from 'typesafe-actions';
import { AsyncState } from '../../../utils/state';
import { MarketInfo } from '../types';
import { coreTypes } from '../actions';

const initialAllMarketsState: AsyncState<MarketInfo[]> =
  createInitialAsyncState<MarketInfo[]>([]);

const initialCertainMarketState: AsyncState<MarketInfo> =
  createInitialAsyncState<MarketInfo>(null);

const fetchAllMarketsReducer = createReducer(
  initialAllMarketsState,
  createHandlers<MarketInfo[]>(coreTypes.FETCH_ALL_MARKETS),
);

const fetchCertainMarketReducer = createReducer(
  initialCertainMarketState,
  createHandlers<MarketInfo>(coreTypes.FETCH_MARKET),
);

export const marketsReducer = combineReducers({
  markets: fetchAllMarketsReducer,
  market: fetchCertainMarketReducer,
});
