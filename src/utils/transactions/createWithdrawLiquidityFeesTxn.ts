import { WalletContextState } from '@solana/wallet-adapter-react';
import { hadeswap, web3 } from 'hadeswap-sdk';

const { withdrawLiquidityFees } = hadeswap.functions.marketFactory;

const sendTxnPlaceHolder = async (): Promise<null> =>
  await Promise.resolve(null);

type CreateWithdrawLiquidityFeesTxn = (params: {
  connection: web3.Connection;
  wallet: WalletContextState;
  pairPubkey: web3.PublicKey;
  authorityAdapter: web3.PublicKey;
}) => Promise<{
  transaction: web3.Transaction;
  signers: web3.Signer[];
}>;

export const createWithdrawLiquidityFeesTxn: CreateWithdrawLiquidityFeesTxn =
  async ({ connection, wallet, pairPubkey, authorityAdapter }) => {
    const { instructions, signers } = await withdrawLiquidityFees({
      programId: new web3.PublicKey(process.env.PROGRAM_PUBKEY),
      connection,
      sendTxn: sendTxnPlaceHolder,
      accounts: {
        pair: pairPubkey,
        authorityAdapter,
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
