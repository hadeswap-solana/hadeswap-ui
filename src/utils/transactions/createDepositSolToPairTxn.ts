import { WalletContextState } from '@solana/wallet-adapter-react';
import { hadeswap, web3 } from 'hadeswap-sdk';

const { depositSolToPair } =
  hadeswap.functions.marketFactory.pair.virtual.deposits;

const sendTxnPlaceHolder = async (): Promise<null> =>
  await Promise.resolve(null);

type CreateDepositSolFromPairTxn = (params: {
  connection: web3.Connection;
  wallet: WalletContextState;
  pairPubkey: string;
  authorityAdapter: string;
  amountOfOrders: number;
}) => Promise<{
  transaction: web3.Transaction;
  signers: web3.Signer[];
}>;

export const createDepositSolToPairTxn: CreateDepositSolFromPairTxn = async ({
  connection,
  wallet,
  pairPubkey,
  authorityAdapter,
  amountOfOrders,
}) => {
  const { instructions, signers } = await depositSolToPair({
    programId: new web3.PublicKey(process.env.PROGRAM_PUBKEY),
    connection,
    sendTxn: sendTxnPlaceHolder,
    accounts: {
      pair: new web3.PublicKey(pairPubkey),
      authorityAdapter: new web3.PublicKey(authorityAdapter),
      userPubkey: wallet.publicKey,
    },
    args: {
      amountOfOrders,
    },
  });

  const transaction = new web3.Transaction();
  transaction.add(...instructions);

  return {
    transaction,
    signers,
  };
};
