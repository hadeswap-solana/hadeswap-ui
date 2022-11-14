import { createCustomAction } from 'typesafe-actions';
import { Pair } from '../types';
import { setResponseDataAction } from '../utils';

export const pairsTypes = {
  SET_MARKET_PAIRS: 'core/SET_MARKET_PAIRS',
  SET_PAIR: 'core/SET_PAIR',
  SET_WALLET_PAIRS: 'core/SET_WALLET_PAIRS',
};

export const pairsActions = {
  setMarketPairs: createCustomAction(
    pairsTypes.SET_MARKET_PAIRS,
    setResponseDataAction<Pair[]>,
  ),
  setPair: createCustomAction(pairsTypes.SET_PAIR, setResponseDataAction<Pair>),
  setWalletPairs: createCustomAction(
    pairsTypes.SET_WALLET_PAIRS,
    setResponseDataAction<Pair[]>,
  ),
};
