import { WalletContextState } from '@solana/wallet-adapter-react';
import { hadeswap, web3 } from 'hadeswap-sdk';
import { CartOrder, CartPair, OrderType } from '../../state/core/types';
import { signAndConfirmTransaction } from '../../utils/transactions';

const {
  buyNftFromPair: createBuyNftFromPairIxLib,
  sellNftToLiquidityPair: createSellNftToLiquidityPairIxLib,
  sellNftToTokenToNftPair: createSellNftToTokenToNftPairIxLib,
} = hadeswap.functions.router;

const sendTxnPlaceHolder = async (): Promise<null> =>
  await Promise.resolve(null);

interface CreateIxParams {
  connection: web3.Connection;
  walletPubkey: web3.PublicKey;
  pair: CartPair;
  order: CartOrder;
}

interface IxAndSigners {
  instructions: web3.TransactionInstruction[];
  signers: web3.Signer[];
}

interface TxnAndSigners {
  transaction: web3.Transaction;
  signers: web3.Signer[];
}

type CreateIx = (params: CreateIxParams) => Promise<IxAndSigners>;

const createBuyNftFromPairIx: CreateIx = async ({
  connection,
  walletPubkey,
  pair,
  order,
}) => {
  const { instructions, signers } = await createBuyNftFromPairIxLib({
    programId: new web3.PublicKey(process.env.PROGRAM_PUBKEY),
    connection,
    sendTxn: sendTxnPlaceHolder,
    accounts: {
      assetReceiver: new web3.PublicKey(pair.assetReceiver),
      nftMint: new web3.PublicKey(order.mint),
      nftPairBox: new web3.PublicKey(order.nftPairBox),
      pair: new web3.PublicKey(pair.pairPubkey),
      vaultNftTokenAccount: new web3.PublicKey(order.vaultTokenAccount),
      userPubkey: walletPubkey,
    },
    args: {
      maxAmountToPay: order.price,
      skipFailed: false,
    },
  });

  return { instructions, signers };
};

const createSellNftFromPairIx: CreateIx = async ({
  connection,
  walletPubkey,
  pair,
  order,
}) => {
  const { instructions, signers } = await (pair.type === 'liquidityProvision'
    ? createSellNftToLiquidityPairIxLib
    : createSellNftToTokenToNftPairIxLib)({
    programId: new web3.PublicKey(process.env.PROGRAM_PUBKEY),
    connection,
    sendTxn: sendTxnPlaceHolder,
    accounts: {
      assetReceiver: new web3.PublicKey(pair.assetReceiver),
      nftMint: new web3.PublicKey(order.mint),
      nftValidationAdapter: new web3.PublicKey(order.nftValidationAdapter),
      pair: new web3.PublicKey(pair.pairPubkey),
      userPubkey: walletPubkey,
    },
    args: {
      minAmountToGet: order.price,
      skipFailed: false,
    },
  });

  return { instructions, signers };
};

export const createIx: CreateIx = async (params) => {
  if (params.order.type === OrderType.SELL) {
    return await createSellNftFromPairIx(params);
  }

  return await createBuyNftFromPairIx(params);
};

export const mergeIxsIntoTxn = (ixs: IxAndSigners[]): TxnAndSigners => {
  const transaction = new web3.Transaction();

  transaction.add(...ixs.map(({ instructions }) => instructions).flat());

  const signers = ixs.map(({ signers }) => signers).flat();

  return {
    transaction,
    signers,
  };
};

type SignTransactionsInSeries = (params: {
  txnAndSigners: TxnAndSigners[];
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<void>;

export const signTransactionsInSeries: SignTransactionsInSeries = async ({
  txnAndSigners,
  connection,
  wallet,
}) => {
  for await (const _ of txnAndSigners.map(({ transaction, signers }) =>
    signAndConfirmTransaction({
      transaction,
      signers,
      connection,
      wallet,
      commitment: 'finalized',
    }),
  )) {
    return null;
  }
};
