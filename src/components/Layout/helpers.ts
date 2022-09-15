import { WalletContextState } from '@solana/wallet-adapter-react';
import { hadeswap, web3 } from 'hadeswap-sdk';
import { CartOrder, CartPair, OrderType } from '../../state/core/types';
import { signAndSendTransaction } from '../../utils/transactions';

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

export interface IxnsData {
  instructions: web3.TransactionInstruction[];
  signers: web3.Signer[];
  nftMint: string;
}

interface TxnData {
  transaction: web3.Transaction;
  signers: web3.Signer[];
  nftMints: string[];
}

type CreateIx = (params: CreateIxParams) => Promise<IxnsData>;

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
      protocolFeeReceiver: new web3.PublicKey(process.env.PROTOCOL_FEE_PUBKEY),
    },
    args: {
      maxAmountToPay: order.price,
      skipFailed: false,
    },
  });

  return { instructions, signers, nftMint: order.mint };
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
      protocolFeeReceiver: new web3.PublicKey(process.env.PROTOCOL_FEE_PUBKEY),
    },
    args: {
      minAmountToGet: order.price,
      skipFailed: false,
    },
  });

  return { instructions, signers, nftMint: order.mint };
};

export const createIx: CreateIx = async (params) => {
  if (params.order.type === OrderType.SELL) {
    return await createSellNftFromPairIx(params);
  }

  return await createBuyNftFromPairIx(params);
};

export const mergeIxsIntoTxn = (ixs: IxnsData[]): TxnData => {
  const transaction = new web3.Transaction();

  transaction.add(...ixs.map(({ instructions }) => instructions).flat());

  const signers = ixs.map(({ signers }) => signers).flat();

  const nftMints = ixs.map(({ nftMint }) => nftMint).flat();

  return {
    transaction,
    signers,
    nftMints,
  };
};

interface TxnDataWithHandlers {
  transaction: web3.Transaction;
  signers: web3.Signer[];
  onBeforeApprove?: () => void;
  onAfterSend?: () => void;
  onSuccess?: () => void;
  onError?: () => void;
}

type SignTransactionsInSeries = (params: {
  txnData: TxnDataWithHandlers[];
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<boolean>;

export const signAndSendTransactionsInSeries: SignTransactionsInSeries =
  async ({ txnData, connection, wallet }) => {
    for (let i = 0; i < txnData.length; ++i) {
      const {
        transaction,
        signers,
        onSuccess,
        onError,
        onBeforeApprove,
        onAfterSend,
      } = txnData[i];
      try {
        await signAndSendTransaction({
          transaction,
          signers,
          connection,
          wallet,
          commitment: 'finalized',
          onBeforeApprove,
          onAfterSend,
        });

        onSuccess?.();
      } catch (error) {
        console.error(error);
        error?.logs && console.error('Error logs: \n', error.logs?.join('\n'));

        onError?.();
        return false;
      }
    }

    return true;
  };
