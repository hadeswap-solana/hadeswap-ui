import { coreActions } from './../actions/index';
import { composeReducers } from './../../../utils/state/reducers';
import { fetchTypes, fetchActions } from './../actions/fetchActions';
import { createReducer } from 'typesafe-actions';

import { RequestStatus, ServerError } from '../../../utils/state';
import { Pair } from '../types';

type PairsState = {
  pairs: Pair[];
  fetchMarketPairsStatus: {
    pubkey: string | null;
    status: RequestStatus;
  };
  fetchCertainPairStatus: {
    status: RequestStatus;
    pubkey: string | null;
  };
  fetchWalletPairsStatus: {
    status: RequestStatus;
    pubkey: string | null;
  };

  messages: ServerError[];
};

const initialPairsState: PairsState = {
  pairs: [],
  fetchMarketPairsStatus: {
    status: RequestStatus.IDLE,
    pubkey: null,
  },
  fetchCertainPairStatus: {
    status: RequestStatus.IDLE,
    pubkey: null,
  },
  fetchWalletPairsStatus: {
    status: RequestStatus.IDLE,
    pubkey: null,
  },
  messages: [],
};

const fetchMarketPairsReducer = createReducer<PairsState>(initialPairsState, {
  [fetchTypes.FETCH_MARKET_PAIRS__PENDING]: (
    state,
    action: ReturnType<typeof coreActions.fetchMarketPairsPending>,
  ) => ({
    ...state,
    fetchMarketPairsStatus: {
      pubkey: action.payload,
      status: RequestStatus.PENDING,
    },
  }),
  [fetchTypes.FETCH_MARKET_PAIRS__FULFILLED]: (
    state,
    action: ReturnType<typeof coreActions.fetchMarketPairsFulfilled>,
  ) => ({
    ...state,
    pairs: [
      ...state.pairs.filter(
        (p) => !action.payload.find((_p) => _p.pairPubkey === p.pairPubkey),
      ),
      ...action.payload,
    ],
    fetchMarketPairsStatus: {
      ...state.fetchMarketPairsStatus,
      status: RequestStatus.FULFILLED,
    },
  }),
  [fetchTypes.FETCH_MARKET_PAIRS__FAILED]: (
    state,
    action: ReturnType<typeof fetchActions.fetchMarketPairsFailed>,
  ) => ({
    ...state,
    fetchMarketPairsStatus: {
      ...state.fetchMarketPairsStatus,
      status: RequestStatus.FULFILLED,
    },
    messages: [...state.messages, action.payload],
  }),
});

const fetchCertainPairReducer = createReducer<PairsState>(initialPairsState, {
  [fetchTypes.FETCH_PAIR__PENDING]: (
    state,
    action: ReturnType<typeof coreActions.fetchPairPending>,
  ) => ({
    ...state,
    fetchCertainPairStatus: {
      pubkey: action.payload,
      status: RequestStatus.PENDING,
    },
  }),
  [fetchTypes.FETCH_PAIR__FULFILLED]: (
    state,
    action: ReturnType<typeof fetchActions.fetchPairFulfilled>,
  ) => ({
    ...state,
    pairs: [
      ...state.pairs.filter((p) => p.pairPubkey !== action.payload.pairPubkey),
      action.payload,
    ],
    fetchCertainPairStatus: {
      ...state.fetchCertainPairStatus,
      status: RequestStatus.FULFILLED,
    },
  }),
  [fetchTypes.FETCH_PAIR__FAILED]: (
    state,
    action: ReturnType<typeof fetchActions.fetchPairFailed>,
  ) => ({
    ...state,
    fetchCertainPairStatus: {
      ...state.fetchCertainPairStatus,
      status: RequestStatus.FULFILLED,
    },
    messages: [...state.messages, action.payload],
  }),
});

const fetchWalletPairsReducer = createReducer<PairsState>(initialPairsState, {
  [fetchTypes.FETCH_WALLET_PAIRS__PENDING]: (
    state,
    action: ReturnType<typeof coreActions.fetchWalletPairsPending>,
  ) => ({
    ...state,
    fetchWalletPairsStatus: {
      pubkey: action.payload,
      status: RequestStatus.PENDING,
    },
  }),
  [fetchTypes.FETCH_WALLET_PAIRS__FULFILLED]: (
    state,
    action: ReturnType<typeof fetchActions.fetchWalletPairsFulfilled>,
  ) => ({
    ...state,
    pairs: [
      ...state.pairs.filter(
        (p) => !action.payload.find((_p) => _p.pairPubkey === p.pairPubkey),
      ),
      ...action.payload,
    ],
    fetchWalletPairsStatus: {
      ...state.fetchWalletPairsStatus,
      status: RequestStatus.FULFILLED,
    },
  }),
  [fetchTypes.FETCH_WALLET_PAIRS__FAILED]: (
    state,
    action: ReturnType<typeof fetchActions.fetchWalletPairsFailed>,
  ) => ({
    ...state,
    fetchWalletPairsStatus: {
      ...state.fetchWalletPairsStatus,
      status: RequestStatus.FULFILLED,
    },
    messages: [...state.messages, action.payload],
  }),
});

export const pairsReducer = composeReducers(
  fetchMarketPairsReducer,
  fetchCertainPairReducer,
  fetchWalletPairsReducer,
);
