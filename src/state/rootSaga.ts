import { all, call, put } from 'redux-saga/effects';
import { connectSocket } from '../utils/state';
import { commonActions } from './common/actions';

import commonSagas from './common/sagas';
import coreSocketSagas from './core/sagas';
import { sagaMiddleware } from './store';

const appInitSaga = function* () {
  const socket = yield call(connectSocket);
  yield put(commonActions.setSocket(socket));
  sagaMiddleware.run(coreSocketSagas(socket));
};

export default function* rootSaga(): Generator {
  yield all([call(appInitSaga), call(commonSagas)]);
}
