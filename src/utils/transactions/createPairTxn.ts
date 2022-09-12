import { WalletContextState } from '@solana/wallet-adapter-react';
import { hadeswap, web3 } from 'hadeswap-sdk';
import {
  BondingCurveType,
  PairType,
} from 'hadeswap-sdk/lib/hadeswap-core/types';

const { initializePair, createClassicAuthorityAdapter, putPairOnMarket } =
  hadeswap.functions.marketFactory;

const sendTxnPlaceHolder = async (): Promise<null> =>
  await Promise.resolve(null);

type CreatePairTxn = (params: {
  connection: web3.Connection;
  wallet: WalletContextState;
  marketPubkey: string;
  bondingCurveType: BondingCurveType;
  pairType: PairType;
  delta: number;
  spotPrice: number;
  fee?: number;
}) => Promise<{
  transaction: web3.Transaction;
  signers: web3.Signer[];
  pairPubkey: string;
  authorityAdapterPubkey: string;
}>;

export const createPairTxn: CreatePairTxn = async ({
  connection,
  wallet,
  marketPubkey,
  bondingCurveType,
  delta,
  spotPrice,
  pairType,
  fee = 0,
}) => {
  const {
    instructions: initializeIxns,
    signers: initializeSigners,
    account: pairPubkey,
  } = await initializePair({
    programId: new web3.PublicKey(process.env.PROGRAM_PUBKEY),
    connection,
    sendTxn: sendTxnPlaceHolder,
    accounts: {
      hadoMarket: new web3.PublicKey(marketPubkey),
      userPubkey: wallet.publicKey,
    },
    args: {
      pairType,
      bondingCurveType,
      delta,
      spotPrice,
      fee,
    },
  });

  const {
    instructions: authorityAdapterIxns,
    signers: authorityAdapterSigners,
    account: authorityAdapterPubkey,
  } = await createClassicAuthorityAdapter({
    programId: new web3.PublicKey(process.env.PROGRAM_PUBKEY),
    connection,
    accounts: {
      pair: pairPubkey,
      userPubkey: wallet.publicKey,
    },
    sendTxn: sendTxnPlaceHolder,
  });

  const { instructions: activateIxns, signers: activateSigners } =
    await putPairOnMarket({
      accounts: {
        authorityAdapter: authorityAdapterPubkey,
        pair: pairPubkey,
        userPubkey: wallet.publicKey,
      },
      programId: new web3.PublicKey(process.env.PROGRAM_PUBKEY),
      connection,
      sendTxn: sendTxnPlaceHolder,
    });

  const transaction = new web3.Transaction();
  transaction.add(...initializeIxns, ...authorityAdapterIxns, ...activateIxns);

  return {
    transaction,
    signers: [
      ...initializeSigners,
      ...authorityAdapterSigners,
      ...activateSigners,
    ],
    pairPubkey: pairPubkey.toBase58(),
    authorityAdapterPubkey: authorityAdapterPubkey.toBase58(),
  };
};
