import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'hadeswap-sdk';

import { createAndSendAllTxns } from './createAndSendAllTxns';

interface TxnsAndSigners {
  transaction: web3.Transaction;
  signers?: web3.Signer[];
}
interface TxnDataWithHandlers {
  txnsAndSigners: TxnsAndSigners[];
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

      const result = await createAndSendAllTxns({
        txnsAndSigners,
        onSuccess,
        onError,
        onBeforeApprove,
        onAfterSend,
        wallet,
        connection,
      });

      if (!result) {
        onError?.();
        return false;
      }
    }
    return true;
  };
