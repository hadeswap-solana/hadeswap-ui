import { combineReducers } from 'redux';
import { cartReducer } from './cartReducer';
import { setCertainMarketReducer } from './marketsReducers';
import { setMarketPairsReducer } from './pairsReducers';
import { setMarketWalletNftsReducer } from './marketWalletNftsReducer';

export default combineReducers({
  marketPairs: setMarketPairsReducer,
  market: setCertainMarketReducer,
  marketWalletNfts: setMarketWalletNftsReducer,
  cart: cartReducer,
});
