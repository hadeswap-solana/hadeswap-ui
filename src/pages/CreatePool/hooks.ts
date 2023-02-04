import React from 'react';
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import { hadeswap, web3 } from 'hadeswap-sdk';
import {
  OrderType,
  PairType,
  BondingCurveType,
} from 'hadeswap-sdk/lib/hadeswap-core/types';
import {
  createIxCardFuncs,
  IX_TYPE,
} from '../../components/TransactionsLoadingModal';
import {
  getArrayByNumber,
  signAndSendAllTransactions,
  signAndSendTransaction,
} from '../../utils/transactions';
import { createTokenForNftPairTxn } from '../../utils/transactions/createTokenForNftPairTxn';
import { createDepositSolToPairTxn } from '../../utils/transactions/createDepositSolToPairTxn';
import { createPairTxn } from '../../utils/transactions/createPairTxn';
import { createDepositNftsToPairTxns } from '../../utils/transactions/createDepositNftsToPairTxns';
import { createDepositLiquidityToPairTxns } from '../../utils/transactions/createDepositLiquidityToPairTxns';
import { txsLoadingModalActions } from '../../state/txsLoadingModal/actions';
import { TxsLoadingModalTextStatus } from '../../state/txsLoadingModal/reducers';
import { notify } from '../../utils';
import { NotifyType } from '../../utils/solanaUtils';
import { useDispatch } from 'react-redux';
import { useConnection } from '../../hooks';
import { Nft } from '../../state/core/types';
import { captureSentryError } from '../../utils/sentry';
import { SOL_WITHDRAW_ORDERS_LIMIT__PER_TXN } from '../../hadeswap';
import { createDepositLiquidityOnlyBuyOrdersTxns } from '../../utils/transactions/createDepositLiquidityOnlyBuyOrdersTxns';
import { createDepositLiquidityOnlySellOrdersTxns } from '../../utils/transactions/createDepositLiquidityOnlySellOrdersTxns';

type UseCreatePool = (
  props: Omit<CreateTxnSplittedDataProps, 'connection' | 'wallet'>,
) => {
  create: () => Promise<void>;
};

export const useCreatePool: UseCreatePool = (props) => {
  const dispatch = useDispatch();
  const connection = useConnection();
  const wallet = useWallet();

  const create = async () => {
    try {
      const splittedTxnsData = await (
        getCreateSplittedDataFunc[props.pairType] ||
        getCreateSplittedDataFunc.DEFAULT
      )({ ...props, connection, wallet });

      if (!splittedTxnsData) return;

      const { firstTxnData, restTxnsData } = splittedTxnsData;

      //? Run First Txn
      await signAndSendTransaction({
        connection,
        wallet,
        transaction: firstTxnData.transaction,
        signers: firstTxnData.signers,
        onBeforeApprove: () => {
          dispatch(
            txsLoadingModalActions.setState({
              visible: true,
              cards: [firstTxnData.loadingModalCard],
              amountOfTxs: (restTxnsData?.length || 0) + 1,
              currentTxNumber: 1,
              textStatus: TxsLoadingModalTextStatus.APPROVE,
            }),
          );
        },
        onAfterSend: () => {
          dispatch(
            txsLoadingModalActions.setTextStatus(
              TxsLoadingModalTextStatus.WAITING,
            ),
          );
        },
      });

      //? Run Rest Txns
      if (restTxnsData?.length) {
        await signAndSendAllTransactions({
          connection,
          wallet,
          txnsAndSigners: restTxnsData.map(({ transaction, signers }) => ({
            transaction,
            signers,
          })),
          onBeforeApprove: () => {
            dispatch(
              txsLoadingModalActions.setState({
                visible: true,
                cards: restTxnsData.map(
                  ({ loadingModalCard }) => loadingModalCard,
                ),
                amountOfTxs: restTxnsData.length + 1,
                currentTxNumber: restTxnsData.length + 1,
                textStatus: TxsLoadingModalTextStatus.APPROVE,
              }),
            );
          },
          onAfterSend: () => {
            dispatch(
              txsLoadingModalActions.setTextStatus(
                TxsLoadingModalTextStatus.WAITING,
              ),
            );
          },
          onSuccess: () => {
            notify({
              message: 'transaction successful!',
              type: NotifyType.SUCCESS,
            });
          },
          onError: () => {
            notify({
              message: 'oops... something went wrong!',
              type: NotifyType.ERROR,
            });
          },
        });
      }

      props?.onAfterTxn();
    } catch (error) {
      console.error(error);
      captureSentryError({
        error,
        wallet,
      });
    } finally {
      dispatch(txsLoadingModalActions.setVisible(false));
    }
  };

  return { create };
};

interface TxnData {
  transaction: web3.Transaction;
  signers?: web3.Signer[];
  loadingModalCard: React.ReactNode;
}

interface SplittedTxnsData {
  firstTxnData: TxnData;
  restTxnsData?: TxnData[];
}

interface CreateTxnSplittedDataProps {
  pairType: PairType;
  buyOrdersAmount: number;
  marketPubkey: string;
  selectedNfts: Nft[];
  curveType: BondingCurveType;
  rawSpotPrice: number;
  rawDelta: number;
  rawFee: number;
  connection: web3.Connection;
  wallet: WalletContextState;
  onAfterTxn?: () => void;
}

type CreateTxnSplittedData = (
  props: CreateTxnSplittedDataProps,
) => Promise<SplittedTxnsData>;

const createTokenForNftTxnSplittedData: CreateTxnSplittedData = async ({
  buyOrdersAmount,
  marketPubkey,
  curveType,
  rawSpotPrice,
  rawDelta,
  connection,
  wallet,
}) => {
  const amountPerChunk = [buyOrdersAmount];

  const cards = amountPerChunk.map((ordersAmount, idx) => {
    const { total: amount }: { total: number } =
      hadeswap.helpers.calculatePricesArray({
        starting_spot_price: rawSpotPrice,
        delta: rawDelta,
        amount: ordersAmount,
        bondingCurveType: curveType,
        orderType: OrderType.Sell,
        counter: idx,
      });

    return createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_SOL_FROM_POOL](amount);
  });

  const {
    pairPubkey,
    transaction: createTxn,
    authorityAdapterPubkey,
    signers: createSigners,
  } = await createTokenForNftPairTxn({
    connection,
    wallet,
    marketPubkey,
    bondingCurveType: curveType,
    pairType: PairType.TokenForNFT,
    delta: rawDelta,
    spotPrice: rawSpotPrice,
    amountOfOrders: amountPerChunk[0],
  });

  const restTxns = await Promise.all(
    amountPerChunk.slice(1).map((amount) =>
      createDepositSolToPairTxn({
        connection,
        wallet,
        pairPubkey: pairPubkey.toBase58(),
        authorityAdapter: authorityAdapterPubkey.toBase58(),
        amountOfOrders: amount,
      }),
    ),
  );

  return {
    firstTxnData: {
      transaction: createTxn,
      signers: createSigners,
      loadingModalCard: cards[0],
    },
    restTxnsData: restTxns.length
      ? restTxns?.map(({ transaction, signers }, idx) => {
          return {
            transaction,
            signers,
            loadingModalCard: cards?.[idx + 1],
          };
        })
      : null,
  };
};

const createNftForTokenTxnSplittedData: CreateTxnSplittedData = async ({
  marketPubkey,
  selectedNfts,
  curveType,
  rawSpotPrice,
  rawDelta,
  rawFee,
  connection,
  wallet,
}) => {
  const {
    pairPubkey,
    transaction: createTxn,
    authorityAdapterPubkey,
    signers: createSigners,
  } = await createPairTxn({
    connection,
    wallet,
    marketPubkey,
    bondingCurveType: curveType,
    pairType: PairType.NftForToken,
    delta: rawDelta,
    spotPrice: rawSpotPrice,
    fee: rawFee,
  });

  const restTxns = await createDepositNftsToPairTxns({
    connection,
    wallet,
    pairPubkey: pairPubkey,
    authorityAdapter: authorityAdapterPubkey,
    nfts: selectedNfts,
  });

  return {
    firstTxnData: {
      transaction: createTxn,
      signers: createSigners,
      loadingModalCard: createIxCardFuncs[IX_TYPE.CREATE_EMPTY_POOL](),
    },
    restTxnsData: restTxns.map(({ transaction, signers }, idx) => {
      return {
        transaction,
        signers,
        loadingModalCard: createIxCardFuncs[
          IX_TYPE.ADD_OR_REMOVE_NFT_FROM_POOL
        ](selectedNfts[idx]),
      };
    }),
  };
};

const createLiquidityProvisionTxnSplittedData: CreateTxnSplittedData = async ({
  marketPubkey,
  selectedNfts,
  curveType,
  rawSpotPrice,
  rawDelta,
  rawFee,
  connection,
  wallet,
  buyOrdersAmount,
}) => {
  const amountOfBuyAndSellOrderPairs = Math.min(
    buyOrdersAmount,
    selectedNfts.length,
  );
  const nftsToDepositWithBuyOrders = selectedNfts.slice(
    0,
    amountOfBuyAndSellOrderPairs,
  );

  const {
    pairPubkey,
    transaction: createTxn,
    authorityAdapterPubkey,
    signers: createSigners,
  } = await createPairTxn({
    connection,
    wallet,
    marketPubkey,
    bondingCurveType: curveType,
    pairType: PairType.LiquidityProvision,
    delta: rawDelta,
    spotPrice: rawSpotPrice,
    fee: rawFee,
  });

  let restTxns = [];

  if (nftsToDepositWithBuyOrders.length > 0) {
    restTxns = await createDepositLiquidityToPairTxns({
      connection,
      wallet,
      pairPubkey: pairPubkey,
      authorityAdapter: authorityAdapterPubkey,
      nfts: nftsToDepositWithBuyOrders,
    });
  }

  const outstandingBuyOrders =
    buyOrdersAmount - nftsToDepositWithBuyOrders.length;

  if (outstandingBuyOrders > 0) {
    restTxns = [
      ...restTxns,
      ...(await createDepositLiquidityOnlyBuyOrdersTxns({
        connection,
        wallet,
        pairPubkey: pairPubkey,
        authorityAdapter: authorityAdapterPubkey,
        buyOrdersAmount: outstandingBuyOrders,
      })),
    ];
  }

  const outstandingNfts = selectedNfts.slice(
    nftsToDepositWithBuyOrders.length,
    selectedNfts.length,
  );

  if (outstandingNfts.length > 0) {
    restTxns = [
      ...restTxns,
      ...(await createDepositLiquidityOnlySellOrdersTxns({
        connection,
        wallet,
        pairPubkey: pairPubkey,
        authorityAdapter: authorityAdapterPubkey,
        nfts: outstandingNfts,
      })),
    ];
  }
  const { array: amounts }: { array: number[] } =
    hadeswap.helpers.calculatePricesArray({
      starting_spot_price: rawSpotPrice,
      delta: rawDelta,
      amount: selectedNfts.length,
      bondingCurveType: curveType,
      orderType: OrderType.Sell,
      counter: 0,
    });

  const restTxnsCards = selectedNfts.map((nft, idx) => {
    return createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_LIQUIDITY_FROM_POOL](
      nft,
      amounts[idx],
    );
  });

  return {
    firstTxnData: {
      transaction: createTxn,
      signers: createSigners,
      loadingModalCard: createIxCardFuncs[IX_TYPE.CREATE_EMPTY_POOL](),
    },
    restTxnsData: restTxns.map(({ transaction, signers }, idx) => {
      return {
        transaction,
        signers,
        loadingModalCard: restTxnsCards[idx],
      };
    }),
  };
};

const getCreateSplittedDataFunc = {
  [PairType.TokenForNFT]: createTokenForNftTxnSplittedData,
  [PairType.NftForToken]: createNftForTokenTxnSplittedData,
  [PairType.LiquidityProvision]: createLiquidityProvisionTxnSplittedData,
  DEFAULT: () => {},
};
