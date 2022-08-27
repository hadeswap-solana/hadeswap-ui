import { composeReducers } from './../../../utils/state/reducers';
import { fetchTypes, fetchActions } from './../actions/fetchActions';
import { createReducer } from 'typesafe-actions';

import { RequestStatus, ServerError } from '../../../utils/state';
import { MarketInfo } from '../types';

type MarketsState = {
  marketInfos: MarketInfo[];
  fetchAllStatus: RequestStatus;
  fetchCertainStatus: {
    status: RequestStatus;
    pubkey: string | null;
  };

  messages: ServerError[];
};

const initialMarketsState: MarketsState = {
  marketInfos: [],
  fetchAllStatus: RequestStatus.IDLE,
  fetchCertainStatus: {
    status: RequestStatus.IDLE,
    pubkey: null,
  },
  messages: [],
};

const fetchAllMarketsReducer = createReducer<MarketsState>(
  initialMarketsState,
  {
    [fetchTypes.FETCH_ALL_MARKETS__PENDING]: (state) => ({
      ...state,
      fetchAllStatus: RequestStatus.PENDING,
    }),
    [fetchTypes.FETCH_ALL_MARKETS__FULFILLED]: (
      state,
      action: ReturnType<typeof fetchActions.fetchAllMarketsFulfilled>,
    ) => ({
      ...state,
      marketInfos: action.payload,
      fetchAllStatus: RequestStatus.FULFILLED,
    }),
    [fetchTypes.FETCH_ALL_MARKETS__FAILED]: (
      state,
      action: ReturnType<typeof fetchActions.fetchAllMarketsFailed>,
    ) => ({
      ...state,
      fetchAllStatus: RequestStatus.FAILED,
      messages: [...state.messages, action.payload],
    }),
  },
);

const fetchCertainMarketReducer = createReducer<MarketsState>(
  initialMarketsState,
  {
    [fetchTypes.FETCH_MARKET__PENDING]: (
      state,
      action: ReturnType<typeof fetchActions.fetchMarketPending>,
    ) => ({
      ...state,
      fetchCertainStatus: {
        pubkey: action.payload,
        status: RequestStatus.PENDING,
      },
    }),
    [fetchTypes.FETCH_MARKET__FULFILLED]: (
      state,
      action: ReturnType<typeof fetchActions.fetchMarketFulfilled>,
    ) => ({
      ...state,
      marketInfos: [
        ...new Map(
          [...state.marketInfos, action.payload].map((m) => [
            m.marketPubkey,
            m,
          ]),
        ).values(),
      ],
      fetchCertainStatus: {
        ...state.fetchCertainStatus,
        status: RequestStatus.FULFILLED,
      },
    }),
    [fetchTypes.FETCH_MARKET__FAILED]: (
      state,
      action: ReturnType<typeof fetchActions.fetchMarketFailed>,
    ) => ({
      ...state,
      fetchCertainStatus: {
        ...state.fetchCertainStatus,
        status: RequestStatus.FAILED,
      },
      messages: [...state.messages, action.payload],
    }),
  },
);

export const marketsReducer = composeReducers(
  fetchAllMarketsReducer,
  fetchCertainMarketReducer,
);
