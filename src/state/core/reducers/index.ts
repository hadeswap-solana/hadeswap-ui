import { combineReducers } from 'redux';
import { cartReducer } from './cartReducer';
import { setCertainMarketReducer } from './marketsReducers';
import { setMarketPairsReducer, fetchPairReducer } from './pairsReducers';
import { setMarketWalletNftsReducer } from './marketWalletNftsReducer';

export default combineReducers({
  marketPairs: setMarketPairsReducer,
  pair: fetchPairReducer,
  market: setCertainMarketReducer,
  marketWalletNfts: setMarketWalletNftsReducer,
  cart: cartReducer,
});
