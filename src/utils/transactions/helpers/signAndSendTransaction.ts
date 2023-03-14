import { web3 } from 'hadeswap-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { notify } from '../..';
import { NotifyType } from '../../solanaUtils';
import { captureSentryError } from '../../sentry';

interface SignAndSendTransactionProps {
  transaction: web3.Transaction;
  signers?: web3.Signer[];
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

type SignAndSendTransaction = (
  props: SignAndSendTransactionProps,
) => Promise<void>;

export const signAndSendTransaction: SignAndSendTransaction = async ({
  transaction,
  signers = [],
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

    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;

    if (signers.length) {
      transaction.sign(...signers);
    }

    const signedTransaction: any = await new Promise((resolve) => {
      setTimeout(async () => {
        try {
          resolve(await wallet.signTransaction(transaction));
        } catch {
          closeModal?.();
        }
      }, signTimeout);
    });

    await connection.sendRawTransaction(signedTransaction.serialize(), {
      skipPreflight: false,
    });

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
      transactionName: 'signAndSendTransaction',
    });
    throw new Error('signAndSendTransaction');
  }
};
