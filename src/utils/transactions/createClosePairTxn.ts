import { WalletContextState } from '@solana/wallet-adapter-react';
import { hadeswap, web3 } from 'hadeswap-sdk';

const { closeVirtualPair } =
  hadeswap.functions.marketFactory.pair.virtual.mutations;

const sendTxnPlaceHolder = async (): Promise<null> =>
  await Promise.resolve(null);

type CreateClosePairTxn = (params: {
  connection: web3.Connection;
  wallet: WalletContextState;
  pairPubkey: string;
  authorityAdapter: string;
}) => Promise<{
  transaction: web3.Transaction;
  signers: web3.Signer[];
}>;

export const createClosePairTxn: CreateClosePairTxn = async ({
  connection,
  wallet,
  pairPubkey,
  authorityAdapter,
}) => {
  const { instructions, signers } = await closeVirtualPair({
    programId: new web3.PublicKey(process.env.PROGRAM_PUBKEY),
    connection,
    sendTxn: sendTxnPlaceHolder,
    accounts: {
      pair: new web3.PublicKey(pairPubkey),
      authorityAdapter: new web3.PublicKey(authorityAdapter),
      userPubkey: wallet.publicKey,
    },
  });

  const transaction = new web3.Transaction();
  transaction.add(...instructions);

  return {
    transaction,
    signers,
  };
};
