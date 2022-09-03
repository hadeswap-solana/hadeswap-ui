import {
  swapTxsLoadingModalActions,
  swapTxsLoadingModalTypes,
} from './../swapTxsLoadingModal/actions';
import { createReducer } from 'typesafe-actions';
import { CartOrder } from '../core/types';

export enum SwapTxsLoadingModalTextStatus {
  APPROVE = 'approve',
  WAITING = 'waiting',
}

export type SwapTxsLoadingModalState = {
  visible: boolean;
  ordersInTx: CartOrder[];
  amountOfTxs: number;
  currentTxNumber: number;
  textStatus: SwapTxsLoadingModalTextStatus;
};

export const initialSwapTxsLoadingModalState: SwapTxsLoadingModalState = {
  visible: false,
  ordersInTx: [],
  amountOfTxs: 0,
  currentTxNumber: 0,
  textStatus: SwapTxsLoadingModalTextStatus.APPROVE,
};

export const swapTxsLoadingModalReducer =
  createReducer<SwapTxsLoadingModalState>(initialSwapTxsLoadingModalState, {
    [swapTxsLoadingModalTypes.SET_STATE]: (
      _,
      { payload }: ReturnType<typeof swapTxsLoadingModalActions.setState>,
    ) => payload,
    [swapTxsLoadingModalTypes.SET_VISIBLE]: (
      state,
      { payload }: ReturnType<typeof swapTxsLoadingModalActions.setVisible>,
    ) => ({
      ...state,
      visible: payload,
    }),
    [swapTxsLoadingModalTypes.SET_TEXT_STATUS]: (
      state,
      { payload }: ReturnType<typeof swapTxsLoadingModalActions.setTextStatus>,
    ) => ({
      ...state,
      textStatus: payload,
    }),
  });
