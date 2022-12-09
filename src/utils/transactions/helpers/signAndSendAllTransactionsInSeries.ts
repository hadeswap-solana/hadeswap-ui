import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'hadeswap-sdk';

import { signAndSendAllTransactions } from './signAndSendAllTransactions';

interface TxnDataWithHandlers {
  txnsAndSigners: {
    transaction: web3.Transaction;
    signers?: web3.Signer[];
  }[];
  onBeforeApprove?: () => void;
  onAfterSend?: () => void;
  onSuccess?: () => void;
  onError?: () => void;
}

type SignAndSendAllTransactionsInSeries = (params: {
  txnsData: TxnDataWithHandlers[];
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<boolean>;

export const signAndSendAllTransactionsInSeries: SignAndSendAllTransactionsInSeries =
  async ({ txnsData, connection, wallet }) => {
    for (let i = 0; i < txnsData.length; ++i) {
      const {
        txnsAndSigners,
        onSuccess,
        onError,
        onBeforeApprove,
        onAfterSend,
      } = txnsData[i];

      const result = await signAndSendAllTransactions({
        txnsAndSigners,
        onSuccess,
        onError,
        onBeforeApprove,
        onAfterSend,
        wallet,
        connection,
        commitment: 'finalized',
      });

      if (!result) {
        onError?.();
        return false;
      }
    }
    return true;
  };
