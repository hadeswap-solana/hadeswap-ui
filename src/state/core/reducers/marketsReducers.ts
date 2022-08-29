import {
  createHandlers,
  createInitialAsyncState,
} from '../../../utils/state/reducers';
import { createReducer } from 'typesafe-actions';
import { AsyncState } from '../../../utils/state';
import { MarketInfo } from '../types';
import { coreTypes } from '../actions';

const initialAllMarketsState: AsyncState<MarketInfo[]> =
  createInitialAsyncState<MarketInfo[]>([]);

const initialCertainMarketState: AsyncState<MarketInfo> =
  createInitialAsyncState<MarketInfo>(null);

export const fetchAllMarketsReducer = createReducer(
  initialAllMarketsState,
  createHandlers<MarketInfo[]>(coreTypes.FETCH_ALL_MARKETS),
);

export const fetchCertainMarketReducer = createReducer(
  initialCertainMarketState,
  createHandlers<MarketInfo>(coreTypes.FETCH_MARKET),
);
