import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'hadeswap-sdk';
import { Nft } from '../../state/core/types';
import { chunk } from 'lodash';
import { PUBKEY_PLACEHOLDER } from '..';

import {
  replaceBuyOrderWithSellOrder,
  replaceSellOrderWithBuyOrder,
} from 'hadeswap-sdk/lib/hadeswap-core/functions/market-factory/pair/virtual/withdrawals';

const sendTxnPlaceHolder = async (): Promise<null> =>
  await Promise.resolve(null);

type CreateReplaceLiquidityOrdersTxns = (params: {
  connection: web3.Connection;
  wallet: WalletContextState;
  pairPubkey: string;
  authorityAdapter: string;
  nftsToDeposit: Nft[];
  nftsToWithdraw: Nft[];
}) => Promise<
  {
    transaction: web3.Transaction;
    signers: web3.Signer[];
  }[]
>;

const IXNS_PER_CHUNK = 1; //? Maybe it will work with 3

export const createReplaceLiquidityOrdersTxns: CreateReplaceLiquidityOrdersTxns =
  async ({
    connection,
    wallet,
    pairPubkey,
    authorityAdapter,
    nftsToDeposit,
    nftsToWithdraw,
  }) => {
    const ixsAndSigners = (
      await Promise.all([
        ...nftsToDeposit.map((nft) =>
          replaceBuyOrderWithSellOrder({
            programId: new web3.PublicKey(process.env.PROGRAM_PUBKEY),
            connection,
            args: {
              proof: nft?.validProof,
            },
            accounts: {
              nftValidationAdapter: new web3.PublicKey(
                nft?.nftValidationAdapter || PUBKEY_PLACEHOLDER,
              ),
              nftValidationAdapterV2:
                nft?.nftValidationAdapterV2 &&
                new web3.PublicKey(nft.nftValidationAdapterV2),
              pair: new web3.PublicKey(pairPubkey),
              authorityAdapter: new web3.PublicKey(authorityAdapter),
              userPubkey: wallet.publicKey,
              nftMint: new web3.PublicKey(nft.mint),
            },
            sendTxn: sendTxnPlaceHolder,
          }),
        ),
        ...nftsToWithdraw.map((nft) =>
          replaceSellOrderWithBuyOrder({
            programId: new web3.PublicKey(process.env.PROGRAM_PUBKEY),
            connection,
            accounts: {
              nftPairBox: new web3.PublicKey(nft.nftPairBox),
              pair: new web3.PublicKey(pairPubkey),
              authorityAdapter: new web3.PublicKey(authorityAdapter),
              userPubkey: wallet.publicKey,
              nftMint: new web3.PublicKey(nft.mint),
            },
            sendTxn: sendTxnPlaceHolder,
          }),
        ),
      ])
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
