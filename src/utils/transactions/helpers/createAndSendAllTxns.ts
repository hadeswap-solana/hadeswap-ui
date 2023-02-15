import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'hadeswap-sdk';

import { signAndConfirmTransaction } from './signAndConfirmTransaction';
import { captureSentryError } from '../../sentry';
import { NotifyType } from '../../solanaUtils';
import { notify } from '../..';

interface TxnsAndSigners {
  transaction: web3.Transaction;
  signers?: web3.Signer[];
}

interface CreateAndSendAllTxnsProps {
  txnsAndSigners: TxnsAndSigners[];
  connection: web3.Connection;
  wallet: WalletContextState;
  commitment?: web3.Commitment;
  onBeforeApprove?: () => void;
  onAfterSend?: () => void;
  onSuccess?: () => void;
  onError?: () => void;
}

type CreateAndSendAllTxns = (
  props: CreateAndSendAllTxnsProps,
) => Promise<boolean>;

export const createAndSendAllTxns: CreateAndSendAllTxns = async ({
  txnsAndSigners,
  connection,
  wallet,
  commitment = 'finalized',
  onBeforeApprove,
  onAfterSend,
  onSuccess,
  onError,
}) => {
  const isSupportV0Transaction = true;
  // wallet.wallet?.adapter?.name !== 'Ledger' ||
  // wallet.wallet?.adapter?.supportedTransactionVersions === null ||
  // (wallet.wallet?.adapter?.supportedTransactionVersions as any) !== 'legacy';

  if (!isSupportV0Transaction) {
    for (let i = 0; i < txnsAndSigners.flat().length; ++i) {
      const { transaction, signers } = txnsAndSigners.flat()[i];

      try {
        await signAndConfirmTransaction({
          transaction,
          signers,
          wallet,
          connection,
          commitment: 'confirmed',
        });
      } catch (error) {
        captureSentryError({
          error,
          wallet,
        });
      }
    }
  } else {
    try {
      onBeforeApprove?.();

      const lookupTable = (
        await connection.getAddressLookupTable(
          new web3.PublicKey(process.env.LOOKUP_TABLE_PUBKEY),
        )
      ).value;

      if (!lookupTable) return;

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash(commitment);

      const versionedTransactions = txnsAndSigners.map(
        ({ transaction, signers }) => {
          const transactionsMessageV0 = new web3.TransactionMessage({
            payerKey: wallet.publicKey,
            recentBlockhash: blockhash,
            instructions: transaction.instructions,
          }).compileToV0Message([]);

          return {
            transaction: new web3.VersionedTransaction(transactionsMessageV0),
            signers,
          };
        },
      );

      versionedTransactions.forEach(({ transaction, signers }) => {
        if (signers?.length) {
          transaction.sign([...signers]);
        }
      });

      const txns = versionedTransactions.map(({ transaction }) => transaction);

      const signedTransactions = await wallet.signAllTransactions(txns);

      const txnSignatures = await Promise.all(
        signedTransactions.map((signedTransaction) =>
          connection.sendTransaction(signedTransaction, { maxRetries: 5 }),
        ),
      );

      notify({
        message: 'transaction sent!',
        type: NotifyType.INFO,
      });

      onAfterSend?.();

      await Promise.all(
        txnSignatures.map((signature) =>
          connection.confirmTransaction({
            signature,
            blockhash,
            lastValidBlockHeight,
          }),
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
  }
};
