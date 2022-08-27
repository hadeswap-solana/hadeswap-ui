import { all, call } from 'redux-saga/effects';

import commonSagas from './common/sagas';
import coreSagas from './core/sagas';

export default function* rootSaga(): Generator {
  yield all([call(commonSagas)]);
  yield all([call(coreSagas)]);
}
