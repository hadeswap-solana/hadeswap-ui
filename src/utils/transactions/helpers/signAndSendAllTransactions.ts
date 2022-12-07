import { web3 } from 'hadeswap-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { notify } from '../..';
import { NotifyType } from '../../solanaUtils';
import { captureSentryError } from '../../sentry';

interface SignAndSendAllTransactionsProps {
  txnsAndSigners: {
    transaction: web3.Transaction;
    signers?: web3.Signer[];
  }[];
  connection: web3.Connection;
  wallet: WalletContextState;
  commitment?: web3.Commitment;
  onBeforeApprove?: () => void;
  onAfterSend?: () => void;
  onSuccess?: () => void;
  onError?: () => void;
}

type SignAndSendAllTransactions = (
  props: SignAndSendAllTransactionsProps,
) => Promise<boolean>;

export const signAndSendAllTransactions: SignAndSendAllTransactions = async ({
  txnsAndSigners,
  connection,
  wallet,
  commitment = 'finalized',
  onBeforeApprove,
  onAfterSend,
  onSuccess,
  onError,
}) => {
  try {
    onBeforeApprove?.();

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    const transactions = txnsAndSigners.map(({ transaction, signers = [] }) => {
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;

      if (signers.length) {
        transaction.sign(...signers);
      }

      return transaction;
    });

    const signedTransactions = await wallet.signAllTransactions(transactions);

    const txnSignatures = await Promise.all(
      signedTransactions.map((txn) =>
        connection.sendRawTransaction(txn.serialize(), {
          skipPreflight: true,
        }),
      ),
    );

    notify({
      message: 'Transactions sent',
      type: NotifyType.INFO,
    });

    onAfterSend?.();

    await Promise.allSettled(
      txnSignatures.map((signature) =>
        connection.confirmTransaction(
          {
            signature,
            blockhash,
            lastValidBlockHeight,
          },
          commitment,
        ),
      ),
    );

    onSuccess?.();

    return true;
  } catch (error) {
    captureSentryError({
      error,
      wallet,
    });

    onError?.();
    return false;
  }
};
