import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'hadeswap-sdk';
import { chunk } from 'lodash';
import { SOL_WITHDRAW_ORDERS_LIMIT__PER_TXN } from '../../hadeswap';
import { getArrayByNumber } from './helpers';
import { depositLiquidityOnlyBuyOrdersToPair } from 'hadeswap-sdk/lib/hadeswap-core/functions/market-factory/pair/virtual/deposits';

const sendTxnPlaceHolder = async (): Promise<null> =>
  await Promise.resolve(null);

type CreateDepositLiquidityOnlyBuyOrdersTxns = (params: {
  connection: web3.Connection;
  wallet: WalletContextState;
  pairPubkey: string;
  authorityAdapter: string;
  buyOrdersAmount: number;
}) => Promise<
  {
    transaction: web3.Transaction;
    signers: web3.Signer[];
  }[]
>;

const IXNS_PER_CHUNK = 1; //? Maybe it will work with 3

export const createDepositLiquidityOnlyBuyOrdersTxns: CreateDepositLiquidityOnlyBuyOrdersTxns =
  async ({
    connection,
    wallet,
    pairPubkey,
    authorityAdapter,
    buyOrdersAmount,
  }) => {
    const amountPerChunk = getArrayByNumber(
      buyOrdersAmount,
      SOL_WITHDRAW_ORDERS_LIMIT__PER_TXN,
    );
    const ixsAndSigners = (
      await Promise.all(
        amountPerChunk.map((amount) =>
          depositLiquidityOnlyBuyOrdersToPair({
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
