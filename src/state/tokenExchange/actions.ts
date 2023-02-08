import { createCustomAction } from 'typesafe-actions';
import { TokenItem } from '../../constants/tokens';

export const tokenExchangeTypes = {
  SET_TOKEN: 'swapTokens/SET_TOKEN',
};

export const tokenExchangeActions = {
  setToken: createCustomAction(
    tokenExchangeTypes.SET_TOKEN,
    (token: TokenItem) => ({ payload: { token } }),
  ),
};
