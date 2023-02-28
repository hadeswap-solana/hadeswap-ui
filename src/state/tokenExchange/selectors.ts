import { createSelector } from 'reselect';
import { TokenItem } from '../../constants/tokens';

export const selectTokenExchange = createSelector(
  (store: any) => store?.tokenExchange.token || null,
  (token: TokenItem) => token,
);
