import { coreTypes, coreActions } from './actions/index';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { web3 } from 'hadeswap-sdk';

import { networkRequest } from '../../utils/state';
import { MarketInfo, Nft, Pair } from './types';
import { selectWalletPublicKey } from '../common/selectors';

const fetchAllMarketsSaga = function* () {
  yield put(coreActions.fetchAllMarketsPending());
  try {
    const data: MarketInfo[] = yield call(networkRequest, {
      url: `https://${process.env.BACKEND_DOMAIN}/markets`,
    });
    yield put(coreActions.fetchAllMarketsFulfilled(data));
  } catch (error) {
    yield put(coreActions.fetchAllMarketsFailed(error));
  }
};

const fetchMarketSaga = function* (
  action: ReturnType<typeof coreActions.fetchMarket>,
) {
  if (!action.payload) {
    return;
  }
  yield put(coreActions.fetchMarketPending(action.payload));
  try {
    const data: MarketInfo = yield call(networkRequest, {
      url: `https://${process.env.BACKEND_DOMAIN}/markets/${action.payload}`,
    });
    yield put(coreActions.fetchMarketFulfilled(data));
  } catch (error) {
    yield put(coreActions.fetchMarketFailed(error));
  }
};

const fetchMarketPairsSaga = function* (
  action: ReturnType<typeof coreActions.fetchMarketPairs>,
) {
  if (!action.payload) {
    return;
  }
  yield put(coreActions.fetchMarketPairsPending(action.payload));
  try {
    const data: Pair[] = yield call(networkRequest, {
      url: `https://${process.env.BACKEND_DOMAIN}/pairs/${action.payload}`,
    });

    yield put(coreActions.fetchMarketPairsFulfilled(data));
  } catch (error) {
    yield put(coreActions.fetchMarketPairsFailed(error));
  }
};

const fetchMarketInfoAndPairsSaga = function* (
  action: ReturnType<typeof coreActions.fetchMarketInfoAndPairs>,
) {
  if (!action.payload) {
    return;
  }
  yield call(fetchMarketSaga, action);
  yield call(fetchMarketPairsSaga, action);
};

const fetchMarketWalletNftsSaga = function* (
  action: ReturnType<typeof coreActions.fetchMarketWalletNfts>,
) {
  const walletPubkey: web3.PublicKey = yield select(selectWalletPublicKey);

  if (!walletPubkey) {
    return;
  }

  yield put(coreActions.fetchMarketWalletNftsPending());
  try {
    const data: Nft[] = yield call(networkRequest, {
      url: `https://${
        process.env.BACKEND_DOMAIN
      }/nfts/${walletPubkey.toBase58()}/${action.payload}`,
    });
    yield put(coreActions.fetchMarketWalletNftsFulfilled(data));
  } catch (error) {
    yield put(coreActions.fetchMarketWalletNftsFailed(error));
  }
};

const fetchWalletPairsSaga = function* () {
  const walletPubkey: web3.PublicKey = yield select(selectWalletPublicKey);

  if (!walletPubkey) {
    return;
  }

  yield put(coreActions.fetchWalletPairsPending(walletPubkey.toBase58()));
  try {
    const data: Pair[] = yield call(networkRequest, {
      url: `https://${
        process.env.BACKEND_DOMAIN
      }/my-pairs/${walletPubkey.toBase58()}`,
    });
    yield put(coreActions.fetchWalletPairsFulfilled(data));
  } catch (error) {
    yield put(coreActions.fetchWalletPairsFailed(error));
  }
};

const fetchPairSaga = function* (
  action: ReturnType<typeof coreActions.fetchPair>,
) {
  if (!action.payload) {
    return;
  }
  yield put(coreActions.fetchPairPending(action.payload));
  try {
    const data: Pair = yield call(networkRequest, {
      url: `https://${process.env.BACKEND_DOMAIN}/pair/${action.payload}`,
    });
    yield put(coreActions.fetchPairFulfilled(data));
  } catch (error) {
    yield put(coreActions.fetchPairFailed(error));
  }
};

const coreSagas = function* (): Generator {
  yield all([takeLatest(coreTypes.FETCH_ALL_MARKETS, fetchAllMarketsSaga)]);
  yield all([takeLatest(coreTypes.FETCH_MARKET, fetchMarketSaga)]);
  yield all([
    takeLatest(coreTypes.FETCH_MARKET_WALLET_NFTS, fetchMarketWalletNftsSaga),
  ]);
  yield all([takeLatest(coreTypes.FETCH_WALLET_PAIRS, fetchWalletPairsSaga)]);
  yield all([takeLatest(coreTypes.FETCH_MARKET_PAIRS, fetchMarketPairsSaga)]);
  yield all([takeLatest(coreTypes.FETCH_PAIR, fetchPairSaga)]);
  yield all([
    takeLatest(
      coreTypes.FETCH_MARKET_INFO_AND_PAIRS,
      fetchMarketInfoAndPairsSaga,
    ),
  ]);
};

export default coreSagas;
