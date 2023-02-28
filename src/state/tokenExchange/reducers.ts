import { tokenExchangeActions, tokenExchangeTypes } from './actions';
import { createReducer } from 'typesafe-actions';
import { TokenItem } from '../../constants/tokens';

export interface TokenExchangeState {
  token: TokenItem | null;
}

export const initialTokenExchangeState: TokenExchangeState = {
  token: null,
};

export const tokenExchangeReducer = createReducer<TokenExchangeState>(
  initialTokenExchangeState,
  {
    [tokenExchangeTypes.SET_TOKEN]: (
      state,
      { payload }: ReturnType<typeof tokenExchangeActions.setToken>,
    ) => ({
      ...state,
      token: payload.token,
    }),
  },
);
