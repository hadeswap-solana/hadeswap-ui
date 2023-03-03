import { WalletContextState } from '@solana/wallet-adapter-react';
import { hadeswap, web3 } from 'hadeswap-sdk';
import { modifyPairByCurrentSpotPrice } from 'hadeswap-sdk/lib/hadeswap-core/functions/market-factory/pair/virtual/mutations';

const { modifyPair } = hadeswap.functions.marketFactory.pair.virtual.mutations;

const sendTxnPlaceHolder = async (): Promise<null> =>
  await Promise.resolve(null);

type CreateModifyPairTxn = (params: {
  connection: web3.Connection;
  wallet: WalletContextState;
  pairPubkey: string;
  authorityAdapter: string;
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
  const { instructions, signers } = await modifyPairByCurrentSpotPrice({
    programId: new web3.PublicKey(process.env.PROGRAM_PUBKEY),
    connection,
    sendTxn: sendTxnPlaceHolder,
    accounts: {
      pair: new web3.PublicKey(pairPubkey),
      authorityAdapter: new web3.PublicKey(authorityAdapter),
      userPubkey: wallet.publicKey,
    },
    args: {
      delta,
      currentSpotPrice: spotPrice,
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
