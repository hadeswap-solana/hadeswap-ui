import { WalletContextState } from '@solana/wallet-adapter-react';
import { hadeswap, web3 } from 'hadeswap-sdk';
import { chunk } from 'lodash';

const { withdrawLiquidityFromBuyOrdersPair } =
  hadeswap.functions.marketFactory.pair.virtual.withdrawals;

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
    const trxs = [];

    for (let i = 0; i < buyOrdersAmountToDelete / 2; i++) {
      trxs.push(
        withdrawLiquidityFromBuyOrdersPair({
          programId: new web3.PublicKey(process.env.PROGRAM_PUBKEY),
          connection,
          accounts: {
            pair: new web3.PublicKey(pairPubkey),
            authorityAdapter: new web3.PublicKey(authorityAdapter),
            userPubkey: wallet.publicKey,
          },
          sendTxn: sendTxnPlaceHolder,
        }),
      );
    }

    const ixsAndSigners = (await Promise.all(trxs)).map(
      ({ instructions, signers }) => ({ instructions, signers }),
    );

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
