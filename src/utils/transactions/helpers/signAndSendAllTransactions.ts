import { web3 } from 'hadeswap-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { notify } from '../..';
import { NotifyType } from '../../solanaUtils';
import { captureSentryError } from '../../sentry';

interface TxnsAndSigners {
  transaction: web3.Transaction;
  signers?: web3.Signer[];
}

interface SignAndSendAllTransactionsProps {
  txnsAndSigners: TxnsAndSigners[];
  connection: web3.Connection;
  wallet: WalletContextState;
  commitment?: web3.Commitment;
  onBeforeApprove?: () => void;
  onAfterSend?: () => void;
  onSuccess?: () => void;
  onError?: () => void;
  signTimeout?: number;
  closeModal?: () => void;
}

type SignAndSendAllTransactions = (
  props: SignAndSendAllTransactionsProps,
) => Promise<void>;

export const signAndSendAllTransactions: SignAndSendAllTransactions = async ({
  txnsAndSigners,
  connection,
  wallet,
  onBeforeApprove,
  onAfterSend,
  onSuccess,
  signTimeout = 0,
  closeModal,
}) => {
  try {
    onBeforeApprove?.();

    const { blockhash } = await connection.getLatestBlockhash();

    const transactions = txnsAndSigners.map(({ transaction, signers = [] }) => {
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;

      if (signers.length) {
        transaction.sign(...signers);
      }

      return transaction;
    });

    const signedTransactions: any = await new Promise((resolve) => {
      setTimeout(async () => {
        try {
          resolve(await wallet.signAllTransactions(transactions));
        } catch {
          closeModal();
        }
      }, signTimeout);
    });

    await Promise.all(
      signedTransactions.map((txn) =>
        connection.sendRawTransaction(txn.serialize(), {
          skipPreflight: false,
        }),
      ),
    );

    notify({
      message: 'transaction sent!',
      type: NotifyType.INFO,
    });

    onAfterSend?.();
    onSuccess?.();
  } catch (error) {
    captureSentryError({
      error,
      wallet,
    });
    throw new Error('signAndSendAllTransactions');
  }
};
