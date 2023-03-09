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

    const signeTransactionsPromise: Promise<web3.Transaction[]> = new Promise(
      (resolve) => {
        setTimeout(async () => {
          resolve(await wallet.signAllTransactions(transactions));
        }, signTimeout);
      },
    );

    signeTransactionsPromise
      .then((result) => {
        Promise.all(
          result.map((txn) =>
            connection.sendRawTransaction(txn.serialize(), {
              skipPreflight: false,
            }),
          ),
        );
      })
      .then(() => {
        notify({
          message: 'transaction sent!',
          type: NotifyType.INFO,
        });

        onAfterSend?.();
        onSuccess?.();
      })
      .catch(() => {
        throw new Error();
      });
  } catch (error) {
    captureSentryError({
      error,
      wallet,
    });
    throw new Error('signAndSendAllTransactions');
  }
};
