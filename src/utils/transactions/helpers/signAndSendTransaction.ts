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

  const {
    context: { slot: minContextSlot },
    value: { blockhash, lastValidBlockHeight },
  } = await connection.getLatestBlockhashAndContext();

  const signature = await wallet.sendTransaction(transaction, connection, {
    minContextSlot,
    signers,
  });

  notify({
    message: 'Transaction sent',
    type: NotifyType.INFO,
  });

  onAfterSend?.();

  return await connection.confirmTransaction(
    {
      blockhash,
      lastValidBlockHeight,
      signature,
    },
    commitment,
  );
};
