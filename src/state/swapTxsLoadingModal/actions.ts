import { createCustomAction } from 'typesafe-actions';
import {
  SwapTxsLoadingModalState,
  SwapTxsLoadingModalTextStatus,
} from './reducers';

export const swapTxsLoadingModalTypes = {
  SET_STATE: 'swapTxsLoadingModal/SET_STATE',
  SET_VISIBLE: 'swapTxsLoadingModal/SET_VISIBLE',
  SET_TEXT_STATUS: 'swapTxsLoadingModal/SET_TEXT_STATUS',
};

export const swapTxsLoadingModalActions = {
  setState: createCustomAction(
    swapTxsLoadingModalTypes.SET_STATE,
    (nextState: SwapTxsLoadingModalState) => ({
      payload: nextState,
    }),
  ),
  setVisible: createCustomAction(
    swapTxsLoadingModalTypes.SET_VISIBLE,
    (visible: boolean) => ({
      payload: visible,
    }),
  ),
  setTextStatus: createCustomAction(
    swapTxsLoadingModalTypes.SET_TEXT_STATUS,
    (status: SwapTxsLoadingModalTextStatus) => ({
      payload: status,
    }),
  ),
};
