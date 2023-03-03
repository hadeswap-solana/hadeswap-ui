import { web3 } from 'hadeswap-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { notify } from '../..';
import { NotifyType } from '../../solanaUtils';

interface SignAndSendTransactionProps {
  transaction: web3.Transaction;
  signers?: web3.Signer[];
  connection: web3.Connection;
  wallet: WalletContextState;
  onBeforeApprove?: () => void;
  onAfterSend?: () => void;
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
}) => {
  onBeforeApprove?.();

  const { blockhash } = await connection.getLatestBlockhash();

  transaction.recentBlockhash = blockhash;
  transaction.feePayer = wallet.publicKey;

  if (signers.length) {
    transaction.sign(...signers);
  }

  const signedTransaction = await wallet.signTransaction(transaction);

  await connection.sendRawTransaction(signedTransaction.serialize(), {
    skipPreflight: false,
  });

  notify({
    message: 'transaction sent!',
    type: NotifyType.INFO,
  });

  onAfterSend?.();

  // return await connection.confirmTransaction(
  //   {
  //     signature,
  //     blockhash,
  //     lastValidBlockHeight,
  //   },
  //   commitment,
  // );
};
