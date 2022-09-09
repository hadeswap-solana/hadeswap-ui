import { ReactNode } from 'react';
import { txsLoadingModalActions, txsLoadingModalTypes } from './actions';
import { createReducer } from 'typesafe-actions';

export enum TxsLoadingModalTextStatus {
  APPROVE = 'approve',
  WAITING = 'waiting',
}

export type TxsLoadingModalState = {
  visible: boolean;
  cards: ReactNode[];
  amountOfTxs: number;
  currentTxNumber: number;
  textStatus: TxsLoadingModalTextStatus;
};

export const initialTxsLoadingModalState: TxsLoadingModalState = {
  visible: false,
  cards: [],
  amountOfTxs: 0,
  currentTxNumber: 0,
  textStatus: TxsLoadingModalTextStatus.APPROVE,
};

export const txsLoadingModalReducer = createReducer<TxsLoadingModalState>(
  initialTxsLoadingModalState,
  {
    [txsLoadingModalTypes.SET_STATE]: (
      _,
      { payload }: ReturnType<typeof txsLoadingModalActions.setState>,
    ) => payload,
    [txsLoadingModalTypes.SET_VISIBLE]: (
      state,
      { payload }: ReturnType<typeof txsLoadingModalActions.setVisible>,
    ) => ({
      ...state,
      visible: payload,
    }),
    [txsLoadingModalTypes.SET_TEXT_STATUS]: (
      state,
      { payload }: ReturnType<typeof txsLoadingModalActions.setTextStatus>,
    ) => ({
      ...state,
      textStatus: payload,
    }),
  },
);
