import { identity } from 'ramda';
import { createSelector } from 'reselect';
import { initialTxsLoadingModalState, TxsLoadingModalState } from './reducers';

export const selectTxsLoadingModalState = createSelector(
  (store: any) =>
    (store?.txsLoadingModal as TxsLoadingModalState) ||
    initialTxsLoadingModalState,
  identity<TxsLoadingModalState>,
);
