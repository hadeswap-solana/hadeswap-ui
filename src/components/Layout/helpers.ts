import { hadeswap, web3 } from 'hadeswap-sdk';
import { CartOrder, CartPair, OrderType } from '../../state/core/types';
import { PUBKEY_PLACEHOLDER } from '../../utils';

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

const PRECISION_CORRECTION = 1000000;

const createBuyNftFromPairIx: CreateIx = async ({
  connection,
  walletPubkey,
  pair,
  order,
}) => {
  // let provisionOrder;
  // const isLiquidityProvision = pair.type === 'liquidityProvision';
  //
  // if (isLiquidityProvision) {
  //   provisionOrder = pair.liquidityProvisionOrders.find((provisionOrder) => {
  //     const sellMathCounter = order.mathCounter + 1;
  //
  //     return (
  //       provisionOrder.orderACounter === sellMathCounter ||
  //       provisionOrder.orderBCounter === sellMathCounter
  //     );
  //   });
  // }

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
      pnft: {},
      maxAmountToPay:
        order.price +
        PRECISION_CORRECTION +
        (pair.market === 'H3vHxrAiGkTS7eDdkMqDBj97BjtkL75JVn8L5arHktsM'
          ? Math.ceil(order.price / 2)
          : 0),
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
  let ix;
  const isLiquidityProvision = pair.type === 'liquidityProvision';

  if (isLiquidityProvision) {
    // const provisionOrder = pair.liquidityProvisionOrders.find(
    //   (provisionOrder) => {
    //     return (
    //       provisionOrder.orderACounter === order.mathCounter ||
    //       provisionOrder.orderBCounter === order.mathCounter
    //     );
    //   },
    // );

    ix = await createSellNftToLiquidityPairIxLib({
      programId: new web3.PublicKey(process.env.PROGRAM_PUBKEY),
      connection,
      sendTxn: sendTxnPlaceHolder,
      accounts: {
        assetReceiver: new web3.PublicKey(pair.assetReceiver),
        nftMint: new web3.PublicKey(order.mint),
        nftValidationAdapter: new web3.PublicKey(
          order?.nftValidationAdapter || PUBKEY_PLACEHOLDER,
        ),
        nftValidationAdapterV2: order?.nftValidationAdapter
          ? undefined
          : new web3.PublicKey(order.nftValidationAdapterV2),
        pair: new web3.PublicKey(pair.pairPubkey),
        userPubkey: walletPubkey,
        protocolFeeReceiver: new web3.PublicKey(
          process.env.PROTOCOL_FEE_PUBKEY,
        ),
      },
      args: {
        pnft: {},
        minAmountToGet: order.price - PRECISION_CORRECTION,
        proof: order?.nftValidationAdapter ? [] : order?.validProof,
        skipFailed: false,
      },
    });
  } else {
    ix = await createSellNftToTokenToNftPairIxLib({
      programId: new web3.PublicKey(process.env.PROGRAM_PUBKEY),
      connection,
      sendTxn: sendTxnPlaceHolder,
      accounts: {
        assetReceiver: new web3.PublicKey(pair.assetReceiver),
        nftMint: new web3.PublicKey(order.mint),
        nftValidationAdapter: new web3.PublicKey(
          order?.nftValidationAdapter || PUBKEY_PLACEHOLDER,
        ),
        nftValidationAdapterV2: order?.nftValidationAdapter
          ? undefined
          : new web3.PublicKey(order.nftValidationAdapterV2),
        pair: new web3.PublicKey(pair.pairPubkey),
        userPubkey: walletPubkey,
        protocolFeeReceiver: new web3.PublicKey(
          process.env.PROTOCOL_FEE_PUBKEY,
        ),
      },
      args: {
        pnft: {},
        minAmountToGet: order.price - PRECISION_CORRECTION,
        proof: order?.nftValidationAdapter ? [] : order?.validProof,
        skipFailed: false,
      },
    });
  }

  const { instructions, signers } = ix;

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
