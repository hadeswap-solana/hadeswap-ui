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
import { fetchWalletNftsReducer } from './walletNftsReducer';

export default combineReducers({
  marketPairs: fetchMarketPairsReducer,
  pair: fetchPairReducer,
  walletPairs: fetchWalletPairsReducer,
  markets: fetchAllMarketsReducer,
  market: fetchCertainMarketReducer,
  walletNfts: fetchWalletNftsReducer,
});
