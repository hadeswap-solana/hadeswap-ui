import { createCustomAction } from 'typesafe-actions';
import { TxsLoadingModalState, TxsLoadingModalTextStatus } from './reducers';

export const txsLoadingModalTypes = {
  SET_STATE: 'swapTxsLoadingModal/SET_STATE',
  SET_VISIBLE: 'swapTxsLoadingModal/SET_VISIBLE',
  SET_TEXT_STATUS: 'swapTxsLoadingModal/SET_TEXT_STATUS',
};

export const txsLoadingModalActions = {
  setState: createCustomAction(
    txsLoadingModalTypes.SET_STATE,
    (nextState: TxsLoadingModalState) => ({
      payload: nextState,
    }),
  ),
  setVisible: createCustomAction(
    txsLoadingModalTypes.SET_VISIBLE,
    (visible: boolean) => ({
      payload: visible,
    }),
  ),
  setTextStatus: createCustomAction(
    txsLoadingModalTypes.SET_TEXT_STATUS,
    (status: TxsLoadingModalTextStatus) => ({
      payload: status,
    }),
  ),
};
