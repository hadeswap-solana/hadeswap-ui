import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'hadeswap-sdk';
import { Nft } from '../../state/core/types';
import { chunk } from 'lodash';
import { PUBKEY_PLACEHOLDER } from '..';
import { depositLiquidityOnlySellOrdersToPair } from 'hadeswap-sdk/lib/hadeswap-core/functions/market-factory/pair/virtual/deposits';

const sendTxnPlaceHolder = async (): Promise<null> =>
  await Promise.resolve(null);

type CreateDepositLiquidityOnlySellOrdersTxns = (params: {
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

const IXNS_PER_CHUNK = 1; //? Maybe it will work with 3
const NFTS_PER_CHUNK = 2;

export const createDepositLiquidityOnlySellOrdersTxns: CreateDepositLiquidityOnlySellOrdersTxns =
  async ({ connection, wallet, pairPubkey, authorityAdapter, nfts }) => {
    const nftsPairs = chunk(nfts, NFTS_PER_CHUNK);

    const ixsAndSigners = (
      await Promise.all(
        nftsPairs.map(([nft1, nft2]) =>
          depositLiquidityOnlySellOrdersToPair({
            programId: new web3.PublicKey(process.env.PROGRAM_PUBKEY),
            connection,
            args: {
              proof1: nft1?.validProof,
              proof2: nft2?.validProof,
            },
            accounts: {
              nftValidationAdapter1: new web3.PublicKey(
                nft1?.nftValidationAdapter || PUBKEY_PLACEHOLDER,
              ),
              nftValidationAdapter2: new web3.PublicKey(
                nft2?.nftValidationAdapter || PUBKEY_PLACEHOLDER,
              ),
              nftValidationAdapterV2:
                nft1?.nftValidationAdapterV2 &&
                new web3.PublicKey(nft1.nftValidationAdapterV2),
              pair: new web3.PublicKey(pairPubkey),
              authorityAdapter: new web3.PublicKey(authorityAdapter),
              userPubkey: wallet.publicKey,
              nftMint: new web3.PublicKey(nft1.mint),
              nftMint2: new web3.PublicKey(nft2.mint),
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
