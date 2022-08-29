import { combineReducers } from 'redux';
import {
  fetchAllMarketsReducer,
  fetchCertainMarketReducer,
} from './marketsReducers';
import {
  fetchMarketPairsReducer,
  fetchPairReducer,
  fetchWalletPairsReducer,
} from './pairsReducers';

export default combineReducers({
  marketPairs: fetchMarketPairsReducer,
  pair: fetchPairReducer,
  walletPairs: fetchWalletPairsReducer,
  markets: fetchAllMarketsReducer,
  market: fetchCertainMarketReducer,
});
