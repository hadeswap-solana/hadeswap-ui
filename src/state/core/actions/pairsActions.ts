import { createCustomAction } from 'typesafe-actions';
import { Pair } from '../types';

export const pairsTypes = {
  SET_MARKET_PAIRS: 'core/SET_MARKET_PAIRS',
};

export const pairsActions = {
  setMarketPairs: createCustomAction(
    pairsTypes.SET_MARKET_PAIRS,
    (data: Pair[]) => ({ payload: data }),
  ),
};
