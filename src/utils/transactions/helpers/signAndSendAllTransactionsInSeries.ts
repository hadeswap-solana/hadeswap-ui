import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'hadeswap-sdk';
import { Dispatch } from 'redux';
import { signAndSendAllTransactions } from './signAndSendAllTransactions';
import { TxnData } from '../../../types/transactions';
import { txsLoadingModalActions } from '../../../state/txsLoadingModal/actions';
import { TxsLoadingModalTextStatus } from '../../../state/txsLoadingModal/reducers';
import { notify } from '../../index';
import { NotifyType } from '../../solanaUtils';
import { ReactNode } from 'react';

interface TxnsAndSigners {
  transaction: web3.Transaction;
  signers?: web3.Signer[];
  loadingModalCard?: ReactNode;
}

interface TxnDataSeries {
  txnsAndSigners: TxnsAndSigners[];
  onBeforeApprove?: () => void;
  onAfterSend?: () => void;
  onSuccess?: () => void;
  onError?: () => void;
}

type SignAndSendAllTransactionsInSeries = (params: {
  txnsData: TxnDataSeries[];
  connection: web3.Connection;
  wallet: WalletContextState;
  signTimeout?: number;
  closeModal?: () => void;
}) => Promise<void>;

export const signAndSendAllTransactionsInSeries: SignAndSendAllTransactionsInSeries =
  async ({ txnsData, connection, wallet, signTimeout, closeModal }) => {
    for (let i = 0; i < txnsData.length; ++i) {
      const {
        txnsAndSigners,
        onSuccess,
        onError,
        onBeforeApprove,
        onAfterSend,
      } = txnsData[i];

      await signAndSendAllTransactions({
        txnsAndSigners,
        onSuccess,
        onError,
        onBeforeApprove,
        onAfterSend,
        wallet,
        connection,
        signTimeout,
        closeModal,
      });
    }
  };

export const getTxnsDataSeries = (
  txnsDataArray: TxnData[][],
  dispatch: Dispatch,
): TxnDataSeries[] => {
  return txnsDataArray.map((txnsData, txnsDataIdx, txnsDataArray) => ({
    txnsAndSigners: txnsData,
    onBeforeApprove: () => {
      txnsData[txnsDataIdx].onBeforeApprove?.();
      dispatch(
        txsLoadingModalActions.setState({
          visible: true,
          cards: txnsData.map(({ loadingModalCard }) => loadingModalCard),
          amountOfTxs: txnsDataArray?.flat()?.length || 0,
          currentTxNumber: null,
          textStatus: TxsLoadingModalTextStatus.APPROVE,
        }),
      );
    },
    onAfterSend: () => {
      txnsData[txnsDataIdx].onAfterSend?.();
      dispatch(
        txsLoadingModalActions.setTextStatus(TxsLoadingModalTextStatus.WAITING),
      );
    },
    onSuccess: () => {
      txnsData[txnsDataIdx].onSuccess?.();
      notify({
        message: 'transaction successful!',
        type: NotifyType.SUCCESS,
      });
    },
  }));
};
