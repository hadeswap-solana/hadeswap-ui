import { identity } from 'ramda';
import { createSelector } from 'reselect';
import {
  initialSwapTxsLoadingModalState,
  SwapTxsLoadingModalState,
} from './reducers';

export const selectSwapTxsLoadingModalState = createSelector(
  (store: any) =>
    (store?.swapTxsLoadingModal as SwapTxsLoadingModalState) ||
    initialSwapTxsLoadingModalState,
  identity<SwapTxsLoadingModalState>,
);
