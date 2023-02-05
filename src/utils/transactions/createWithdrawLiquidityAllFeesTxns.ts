import { WalletContextState } from '@solana/wallet-adapter-react';
import { hadeswap, web3 } from 'hadeswap-sdk';
import { chunk } from 'lodash';
import { BasePair } from '../../state/core/types';

const { withdrawVirtualFees } =
  hadeswap.functions.marketFactory.pair.virtual.withdrawals;

type CreateWithdrawLiquidityAllFeesTxns = (params: {
  connection: web3.Connection;
  wallet: WalletContextState;
  poolsWithFees: BasePair[];
}) => Promise<
  {
    transaction: web3.Transaction;
    signers: web3.Signer[];
  }[]
>;

const IXNS_PER_CHUNK = 2; //? Maybe it will work with 3

export const createWithdrawLiquidityAllFeesTxns: CreateWithdrawLiquidityAllFeesTxns =
  async ({ connection, wallet, poolsWithFees }) => {
    const ixsAndSigners = (
      await Promise.all(
        poolsWithFees.map((pool) =>
          withdrawVirtualFees({
            programId: new web3.PublicKey(process.env.PROGRAM_PUBKEY),
            connection,
            accounts: {
              pair: new web3.PublicKey(pool.pairPubkey),
              authorityAdapter: new web3.PublicKey(pool.authorityAdapterPubkey),
              userPubkey: wallet.publicKey,
            },
          }),
        ),
      )
    ).map(({ instructions, signers }) => ({ instructions, signers }));

    const ixsAndSignersChunks = chunk(ixsAndSigners, IXNS_PER_CHUNK);

    return ixsAndSignersChunks.map((chunk) => {
      const transaction = new web3.Transaction();
      transaction.add(...chunk.map(({ instructions }) => instructions).flat());

      return {
        transaction,
        signers: chunk.map(({ signers }) => signers).flat(),
      };
    });
  };
