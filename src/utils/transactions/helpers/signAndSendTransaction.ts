import { web3 } from 'hadeswap-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { notify } from '../..';
import { NotifyType } from '../../solanaUtils';

interface SignAndSendTransactionProps {
  transaction: web3.Transaction;
  signers?: web3.Signer[];
  connection: web3.Connection;
  wallet: WalletContextState;
  commitment?: web3.Commitment;
  onBeforeApprove?: () => void;
  onAfterSend?: () => void;
}

type SignAndSendTransaction = (
  props: SignAndSendTransactionProps,
) => Promise<web3.RpcResponseAndContext<web3.SignatureResult>>;

export const signAndSendTransaction: SignAndSendTransaction = async ({
  transaction,
  signers = [],
  connection,
  wallet,
  commitment = 'finalized',
  onBeforeApprove,
  onAfterSend,
}) => {
  onBeforeApprove?.();

  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash();

  transaction.recentBlockhash = blockhash;
  transaction.feePayer = wallet.publicKey;

  if (signers.length) {
    transaction.sign(...signers);
  }

  const signedTransaction = await wallet.signTransaction(transaction);

  const signature = await connection.sendRawTransaction(
    signedTransaction.serialize(),
    { skipPreflight: false },
  );

  notify({
    message: 'Transaction sent',
    type: NotifyType.INFO,
  });

  onAfterSend?.();

  return await connection.confirmTransaction(
    {
      signature,
      blockhash,
      lastValidBlockHeight,
    },
    commitment,
  );
};
