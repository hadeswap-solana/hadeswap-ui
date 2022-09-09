import { WalletContextState } from '@solana/wallet-adapter-react';
import { hadeswap, web3 } from 'hadeswap-sdk';
import { Nft } from '../../state/core/types';
import { chunk } from 'lodash';

const { withdrawLiquidityFromPair } = hadeswap.functions.marketFactory;

const sendTxnPlaceHolder = async (): Promise<null> =>
  await Promise.resolve(null);

type CreateWithdrawLiquidityFromPairTxns = (params: {
  connection: web3.Connection;
  wallet: WalletContextState;
  pairPubkey: web3.PublicKey;
  authorityAdapter: web3.PublicKey;
  nfts: Nft[];
}) => Promise<
  {
    transaction: web3.Transaction;
    signers: web3.Signer[];
  }[]
>;

const IXNS_PER_CHUNK = 2; //? Maybe it will work with 3

export const createWithdrawLiquidityFromPairTxns: CreateWithdrawLiquidityFromPairTxns =
  async ({ connection, wallet, pairPubkey, authorityAdapter, nfts }) => {
    const ixsAndSigners = (
      await Promise.all(
        nfts.map((nft) =>
          withdrawLiquidityFromPair({
            programId: new web3.PublicKey(process.env.PROGRAM_PUBKEY),
            connection,
            accounts: {
              nftPairBox: new web3.PublicKey(nft.nftPairBox),
              pair: pairPubkey,
              authorityAdapter,
              userPubkey: wallet.publicKey,
              nftMint: new web3.PublicKey(nft.mint),
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
