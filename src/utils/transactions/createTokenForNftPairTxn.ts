import { hadeswap, web3 } from 'hadeswap-sdk';
import {
  BondingCurveType,
  PairType,
} from 'hadeswap-sdk/lib/hadeswap-core/types';
import { WalletContextState } from '@solana/wallet-adapter-react';

const {
  initializePair,
  createClassicAuthorityAdapter,
  putPairOnMarket,
  depositSolToPair,
} = hadeswap.functions.marketFactory;

const sendTxnPlaceHolder = async (): Promise<null> =>
  await Promise.resolve(null);

type CreateTokenForNftPairTxn = (params: {
  connection: web3.Connection;
  wallet: WalletContextState;
  marketPubkey: string;
  bondingCurveType: BondingCurveType;
  pairType: PairType;
  delta: number;
  spotPrice: number;
  amountOfOrders: number;
}) => Promise<{
  transaction: web3.Transaction;
  signers: web3.Signer[];
  pairPubkey: web3.PublicKey;
}>;

export const createTokenForNftPairTxn: CreateTokenForNftPairTxn = async ({
  connection,
  wallet,
  marketPubkey,
  bondingCurveType,
  pairType,
  delta,
  spotPrice,
  amountOfOrders,
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
      fee: 0,
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

  const { instructions: depositSolIxns, signers: depositSolSigners } =
    await depositSolToPair({
      programId: new web3.PublicKey(process.env.PROGRAM_PUBKEY),
      connection,
      sendTxn: sendTxnPlaceHolder,
      accounts: {
        authorityAdapter: authorityAdapterPubkey,
        pair: pairPubkey,
        userPubkey: wallet.publicKey,
      },
      args: {
        amountOfOrders,
      },
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
  transaction.add(
    ...initializeIxns,
    ...authorityAdapterIxns,
    ...depositSolIxns,
    ...activateIxns,
  );

  return {
    transaction,
    signers: [
      ...initializeSigners,
      ...authorityAdapterSigners,
      ...depositSolSigners,
      ...activateSigners,
    ],
    pairPubkey,
  };
};
