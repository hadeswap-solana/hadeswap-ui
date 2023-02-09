import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'hadeswap-sdk';

import { createAndSendTxn } from './createAndSendTxn';
import { captureSentryError } from '../../sentry';

interface TxnDataWithHandlers {
  transaction: web3.Transaction;
  signers: web3.Signer[];
  onBeforeApprove?: () => void;
  onAfterSend?: () => void;
  onSuccess?: () => void;
  onError?: () => void;
}

type SignTransactionsInSeries = (params: {
  txnData: TxnDataWithHandlers[];
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<boolean>;

export const signAndSendTransactionsInSeries: SignTransactionsInSeries =
  async ({ txnData, connection, wallet }) => {
    for (let i = 0; i < txnData.length; ++i) {
      const {
        transaction,
        signers,
        onSuccess,
        onError,
        onBeforeApprove,
        onAfterSend,
      } = txnData[i];
      try {
        await createAndSendTxn({
          txInstructions: transaction?.instructions,
          additionalSigners: signers,
          connection,
          wallet,
          onBeforeApprove,
          onAfterSend,
        });

        onSuccess?.();
      } catch (error) {
        captureSentryError({
          error,
          wallet,
        });

        onError?.();
        return false;
      }
    }

    return true;
  };
