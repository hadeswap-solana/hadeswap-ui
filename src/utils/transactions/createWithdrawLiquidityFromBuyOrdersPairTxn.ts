import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'hadeswap-sdk';
import { withdrawLiquidityOnlyBuyOrders } from 'hadeswap-sdk/lib/hadeswap-core/functions/market-factory/pair/virtual/withdrawals';
import { chunk } from 'lodash';
import { SOL_WITHDRAW_ORDERS_LIMIT__PER_TXN } from '../../hadeswap';
import { getArrayByNumber } from './helpers';

const sendTxnPlaceHolder = async (): Promise<null> =>
  await Promise.resolve(null);

type CreateWithdrawLiquidityFromBuyOrdersPair = (params: {
  connection: web3.Connection;
  wallet: WalletContextState;
  pairPubkey: string;
  authorityAdapter: string;
  buyOrdersAmountToDelete: number;
}) => Promise<
  {
    transaction: web3.Transaction;
    signers: web3.Signer[];
  }[]
>;

const IXNS_PER_CHUNK = 1;

export const createWithdrawLiquidityFromBuyOrdersPair: CreateWithdrawLiquidityFromBuyOrdersPair =
  async ({
    connection,
    wallet,
    pairPubkey,
    authorityAdapter,
    buyOrdersAmountToDelete,
  }) => {
    const amountPerChunk = [buyOrdersAmountToDelete];

    const ixsAndSigners = (
      await Promise.all(
        amountPerChunk.map((amount) =>
          withdrawLiquidityOnlyBuyOrders({
            programId: new web3.PublicKey(process.env.PROGRAM_PUBKEY),
            connection,
            args: {
              amountOfOrders: amount,
            },
            accounts: {
              pair: new web3.PublicKey(pairPubkey),
              authorityAdapter: new web3.PublicKey(authorityAdapter),
              userPubkey: wallet.publicKey,
            },
            sendTxn: sendTxnPlaceHolder,
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
