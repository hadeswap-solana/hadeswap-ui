import { createCustomAction } from 'typesafe-actions';
import { MarketInfo } from '../types';
import { setResponseDataAction } from '../utils';

export const marketTypes = {
  SET_MARKET: 'core/SET_MARKET',
  SET_ALL_MARKETS: 'core/SET_ALL_MARKETS',
};

export const marketActions = {
  setMarket: createCustomAction(
    marketTypes.SET_MARKET,
    setResponseDataAction<MarketInfo>,
  ),
  setAllMarkets: createCustomAction(
    marketTypes.SET_ALL_MARKETS,
    setResponseDataAction<MarketInfo[]>,
  ),
};
