import { combineReducers } from 'redux';

import commonReducers from './common/reducers';
import coreReducers from './core/reducers';

const rootReducers = combineReducers({
  common: commonReducers,
  core: coreReducers,
});

export default rootReducers;
