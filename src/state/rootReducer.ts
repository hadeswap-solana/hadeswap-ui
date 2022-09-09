import { combineReducers } from 'redux';

import commonReducers from './common/reducers';
import coreReducers from './core/reducers';
import { txsLoadingModalReducer } from './txsLoadingModal/reducers';

const rootReducers = combineReducers({
  common: commonReducers,
  core: coreReducers,
  txsLoadingModal: txsLoadingModalReducer,
});

export default rootReducers;
