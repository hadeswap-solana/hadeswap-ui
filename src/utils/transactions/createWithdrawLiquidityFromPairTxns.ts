import { WalletContextState } from '@solana/wallet-adapter-react';
import { hadeswap, web3 } from 'hadeswap-sdk';
import { Nft } from '../../state/core/types';
import { chunk } from 'lodash';

const { withdrawLiquidityFromBalancedPair } =
  hadeswap.functions.marketFactory.pair.virtual.withdrawals;

const sendTxnPlaceHolder = async (): Promise<null> =>
  await Promise.resolve(null);

type CreateWithdrawLiquidityFromPairTxns = (params: {
  connection: web3.Connection;
  wallet: WalletContextState;
  pairPubkey: string;
  liquidityProvisionEdgeOrderToWithdraw: string;
  authorityAdapter: string;
  nfts: Nft[];
}) => Promise<
  {
    transaction: web3.Transaction;
    signers: web3.Signer[];
  }[]
>;

const IXNS_PER_CHUNK = 2; //? Maybe it will work with 3

export const createWithdrawLiquidityFromPairTxns: CreateWithdrawLiquidityFromPairTxns =
  async ({
    connection,
    wallet,
    pairPubkey,
    liquidityProvisionEdgeOrderToWithdraw,
    authorityAdapter,
    nfts,
  }) => {
    const ixsAndSigners = (
      await Promise.all(
        nfts.map((nft) =>
          withdrawLiquidityFromBalancedPair({
            programId: new web3.PublicKey(process.env.PROGRAM_PUBKEY),
            connection,
            accounts: {
              liquidityProvisionOrderToReplace: new web3.PublicKey(
                liquidityProvisionEdgeOrderToWithdraw,
              ), // same if virtual
              liquidityProvisionOrderToWithdraw: new web3.PublicKey(
                liquidityProvisionEdgeOrderToWithdraw,
              ),
              nftPairBox: new web3.PublicKey(nft.nftPairBox),
              pair: new web3.PublicKey(pairPubkey),
              authorityAdapter: new web3.PublicKey(authorityAdapter),
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
