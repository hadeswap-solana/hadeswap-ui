import { combineReducers } from 'redux';
import { cartReducer } from './cartReducer';
import {
  setCertainMarketReducer,
  setAllMarketsReducer,
} from './marketsReducers';
import {
  setMarketPairsReducer,
  setPairReducer,
  setWalletPairsReducer,
} from './pairsReducers';
import { setMarketWalletNftsReducer } from './marketWalletNftsReducer';

export default combineReducers({
  marketPairs: setMarketPairsReducer,
  walletPairs: setWalletPairsReducer,
  pair: setPairReducer,
  market: setCertainMarketReducer,
  allMarkets: setAllMarketsReducer,
  marketWalletNfts: setMarketWalletNftsReducer,
  cart: cartReducer,
});
