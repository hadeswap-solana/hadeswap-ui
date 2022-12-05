import { WalletContextState } from '@solana/wallet-adapter-react';
import { hadeswap, web3 } from 'hadeswap-sdk';
import { Nft } from '../../state/core/types';
import { chunk } from 'lodash';

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

const IXNS_PER_CHUNK = 2; //? Maybe it will work with 3

export const createWithdrawLiquidityFromSellOrdersPair: CreateWithdrawLiquidityFromSellOrdersPair =
  async ({ connection, wallet, pairPubkey, authorityAdapter, nfts }) => {
    const ixsAndSigners = (
      await Promise.all(
        chunk(nfts, 2).map((nftsPair) => {
          return withdrawLiquidityFromSellOrdersPair({
            programId: new web3.PublicKey(process.env.PROGRAM_PUBKEY),
            connection,
            accounts: {
              pair: new web3.PublicKey(pairPubkey),
              authorityAdapter: new web3.PublicKey(authorityAdapter),
              userPubkey: wallet.publicKey,
              nftMintFirst: new web3.PublicKey(nftsPair[0].mint),
              nftPairBoxFirst: new web3.PublicKey(nftsPair[0].nftPairBox),
              nftMintSecond: new web3.PublicKey(nftsPair[1].mint),
              nftPairBoxSecond: new web3.PublicKey(nftsPair[1].nftPairBox),
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
