import { combineReducers } from 'redux';
import { cartReducer } from './cartReducer';
import {
  fetchAllMarketsReducer,
  fetchCertainMarketReducer,
} from './marketsReducers';
import { fetchMarketPairsReducer, fetchPairReducer } from './pairsReducers';
import { fetchMarketWalletNftsReducer } from './marketWalletNftsReducer';

export default combineReducers({
  marketPairs: fetchMarketPairsReducer,
  pair: fetchPairReducer,
  markets: fetchAllMarketsReducer,
  market: fetchCertainMarketReducer,
  marketWalletNfts: fetchMarketWalletNftsReducer,
  cart: cartReducer,
});
