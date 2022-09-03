import { combineReducers } from 'redux';

import commonReducers from './common/reducers';
import coreReducers from './core/reducers';
import { swapTxsLoadingModalReducer } from './swapTxsLoadingModal/reducers';

const rootReducers = combineReducers({
  common: commonReducers,
  core: coreReducers,
  swapTxsLoadingModal: swapTxsLoadingModalReducer,
});

export default rootReducers;
