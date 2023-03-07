import { Dispatch } from 'redux';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'hadeswap-sdk';
import { TxnData } from '../../../types/transactions';
import { txsLoadingModalActions } from '../../../state/txsLoadingModal/actions';
import { TxsLoadingModalTextStatus } from '../../../state/txsLoadingModal/reducers';
import { notify } from '../../index';
import { NotifyType } from '../../solanaUtils';
import { signAndSendTransaction } from './signAndSendTransaction';

type SignAndSendTransactionsOneByOne = (params: {
  txnsData: TxnData[];
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<void>;

export const signAndSendTransactionsOneByOne: SignAndSendTransactionsOneByOne =
  async ({ txnsData, connection, wallet }) => {
    for (let i = 0; i < txnsData.length; ++i) {
      await signAndSendTransaction({
        transaction: txnsData[i].transaction,
        signers: txnsData[i].signers,
        onBeforeApprove: txnsData[i].onBeforeApprove,
        onAfterSend: txnsData[i].onAfterSend,
        onSuccess: txnsData[i].onSuccess,
        onError: txnsData[i].onError,
        connection,
        wallet,
      });
    }
  };

export const getTxnsDataOneByOne = (
  txnsDataArray: TxnData[],
  dispatch: Dispatch,
): TxnData[] => {
  return txnsDataArray.map((txn, index) => ({
    ...txn,
    onBeforeApprove: () => {
      txn.onBeforeApprove?.();
      dispatch(
        txsLoadingModalActions.setState({
          visible: true,
          cards: [txn.loadingModalCard],
          amountOfTxs: txnsDataArray?.length || 0,
          currentTxNumber: index + 1,
          textStatus: TxsLoadingModalTextStatus.APPROVE,
        }),
      );
    },
    onAfterSend: () => {
      txn.onAfterSend?.();
      dispatch(
        txsLoadingModalActions.setTextStatus(TxsLoadingModalTextStatus.WAITING),
      );
    },
    onSuccess: () => {
      txn.onSuccess?.();
      notify({
        message: 'transaction successful!',
        type: NotifyType.SUCCESS,
      });
    },
  }));
};
