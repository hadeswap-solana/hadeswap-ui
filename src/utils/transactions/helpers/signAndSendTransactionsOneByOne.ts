import { Dispatch } from 'redux';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'hadeswap-sdk';
import { TxnData } from '../../../pages/EditPool/hooks/usePoolChange/types';
import { txsLoadingModalActions } from '../../../state/txsLoadingModal/actions';
import { TxsLoadingModalTextStatus } from '../../../state/txsLoadingModal/reducers';
import { notify } from '../../index';
import { NotifyType } from '../../solanaUtils';
import { signAndSendTransaction } from './signAndSendTransaction';

export interface TxnsDataOneByOne extends TxnData {
  onBeforeApprove?: () => void;
  onAfterSend?: () => void;
  onSuccess?: () => void;
  onError?: () => void;
}

type SignAndSendTransactionsOneByOne = (params: {
  txnsData: TxnsDataOneByOne[];
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
): TxnsDataOneByOne[] => {
  return txnsDataArray.map((txn, index) => ({
    ...txn,
    onBeforeApprove: () =>
      dispatch(
        txsLoadingModalActions.setState({
          visible: true,
          cards: [txn.loadingModalCard],
          amountOfTxs: txnsDataArray?.length || 0,
          currentTxNumber: index + 1,
          textStatus: TxsLoadingModalTextStatus.APPROVE,
        }),
      ),
    onAfterSend: () =>
      dispatch(
        txsLoadingModalActions.setTextStatus(TxsLoadingModalTextStatus.WAITING),
      ),
    onSuccess: () =>
      notify({
        message: 'transaction successful!',
        type: NotifyType.SUCCESS,
      }),
  }));
};
