import { createCustomAction } from 'typesafe-actions';
import { MarketInfo } from '../types';

export const marketTypes = {
  SET_MARKET: 'core/SET_MARKET',
};

export const marketActions = {
  setMarket: createCustomAction(marketTypes.SET_MARKET, (data: MarketInfo) => ({
    payload: data,
  })),
};
