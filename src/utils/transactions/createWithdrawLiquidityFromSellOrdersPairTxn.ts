import { WalletContextState } from '@solana/wallet-adapter-react';
import { hadeswap, web3 } from 'hadeswap-sdk';
import { Nft } from '../../state/core/types';
import { chunk } from 'lodash';
import { withdrawLiquiditySingleSellOrder } from 'hadeswap-sdk/lib/hadeswap-core/functions/market-factory/pair/virtual/withdrawals';

const { withdrawLiquidityFromSellOrdersPair } =
  hadeswap.functions.marketFactory.pair.virtual.withdrawals;

const sendTxnPlaceHolder = async (): Promise<null> =>
  await Promise.resolve(null);

type CreateWithdrawLiquidityFromSellOrdersPair = (params: {
  connection: web3.Connection;
  wallet: WalletContextState;
  pairPubkey: string;
  authorityAdapter: string;
  nfts: Nft[];
}) => Promise<
  {
    transaction: web3.Transaction;
    signers: web3.Signer[];
  }[]
>;

const IXNS_PER_CHUNK = 1;

export const createWithdrawLiquidityFromSellOrdersPair: CreateWithdrawLiquidityFromSellOrdersPair =
  async ({ connection, wallet, pairPubkey, authorityAdapter, nfts }) => {
    const ixsAndSigners = (
      await Promise.all(
        nfts.map((nft) => {
          return withdrawLiquiditySingleSellOrder({
            programId: new web3.PublicKey(process.env.PROGRAM_PUBKEY),
            connection,
            accounts: {
              pair: new web3.PublicKey(pairPubkey),
              authorityAdapter: new web3.PublicKey(authorityAdapter),
              userPubkey: wallet.publicKey,
              nftMint: new web3.PublicKey(nft.mint),
              nftPairBox: new web3.PublicKey(nft.nftPairBox),
            },
            sendTxn: sendTxnPlaceHolder,
          });
        }),
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
