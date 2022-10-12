import { WalletContextState } from '@solana/wallet-adapter-react';
import { hadeswap, web3 } from 'hadeswap-sdk';
import { chunk } from 'lodash';

const { withdrawLiquidityOrderVirtualFees } =
  hadeswap.functions.marketFactory.pair.virtual.withdrawals;

const sendTxnPlaceHolder = async (): Promise<null> =>
  await Promise.resolve(null);

type CreateWithdrawLiquidityFeesTxns = (params: {
  connection: web3.Connection;
  wallet: WalletContextState;
  pairPubkey: string;
  authorityAdapter: string;
  liquidityProvisionOrders: any[];
}) => Promise<
  {
    transaction: web3.Transaction;
    signers: web3.Signer[];
  }[]
>;

const IXNS_PER_CHUNK = 2; //? Maybe it will work with 3

export const createWithdrawLiquidityFeesTxns: CreateWithdrawLiquidityFeesTxns =
  async ({
    connection,
    wallet,
    pairPubkey,
    authorityAdapter,
    liquidityProvisionOrders,
  }) => {
    const ixsAndSigners = (
      await Promise.all(
        liquidityProvisionOrders
          .filter((order) => order.accumulatedFee)
          .map((order) =>
            withdrawLiquidityOrderVirtualFees({
              programId: new web3.PublicKey(process.env.PROGRAM_PUBKEY),
              connection,
              sendTxn: sendTxnPlaceHolder,
              accounts: {
                pair: new web3.PublicKey(pairPubkey),
                authorityAdapter: new web3.PublicKey(authorityAdapter),
                userPubkey: wallet.publicKey,
                liquidityProvisionOrder: new web3.PublicKey(
                  order.liquidityProvisionOrder,
                ),
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
