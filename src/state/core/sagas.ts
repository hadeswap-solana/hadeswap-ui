import { coreTypes, coreActions } from './actions/index';
import { all, call, put, takeLatest } from 'redux-saga/effects';

import { networkRequest } from '../../utils/state';
import { MarketInfo } from './types';

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

const coreSagas = function* (): Generator {
  yield all([takeLatest(coreTypes.FETCH_ALL_MARKETS, fetchAllMarketsSaga)]);
  yield all([takeLatest(coreTypes.FETCH_MARKET, fetchMarketSaga)]);
};

export default coreSagas;
