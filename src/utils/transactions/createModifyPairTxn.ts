import { WalletContextState } from '@solana/wallet-adapter-react';
import { hadeswap, web3 } from 'hadeswap-sdk';

const { modifyPair } = hadeswap.functions.marketFactory;

const sendTxnPlaceHolder = async (): Promise<null> =>
  await Promise.resolve(null);

type CreateModifyPairTxn = (params: {
  connection: web3.Connection;
  wallet: WalletContextState;
  pairPubkey: web3.PublicKey;
  authorityAdapter: web3.PublicKey;
  delta: number;
  spotPrice: number;
  fee?: number;
}) => Promise<{
  transaction: web3.Transaction;
  signers: web3.Signer[];
}>;

export const createModifyPairTxn: CreateModifyPairTxn = async ({
  connection,
  wallet,
  pairPubkey,
  authorityAdapter,
  delta,
  spotPrice,
  fee = 0,
}) => {
  const { instructions, signers } = await modifyPair({
    programId: new web3.PublicKey(process.env.PROGRAM_PUBKEY),
    connection,
    sendTxn: sendTxnPlaceHolder,
    accounts: {
      pair: pairPubkey,
      authorityAdapter,
      userPubkey: wallet.publicKey,
    },
    args: {
      delta,
      spotPrice,
      fee,
    },
  });

  const transaction = new web3.Transaction();
  transaction.add(...instructions);

  return {
    transaction,
    signers,
  };
};
