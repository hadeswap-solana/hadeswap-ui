import React from 'react';
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'hadeswap-sdk';
import {
  PairType,
  BondingCurveType,
} from 'hadeswap-sdk/lib/hadeswap-core/types';
import {
  createIxCardFuncs,
  IX_TYPE,
} from '../../components/TransactionsLoadingModal';
import {
  createAndSendAllTxns,
  createAndSendTxn,
} from '../../utils/transactions';
import { createTokenForNftPairTxn } from '../../utils/transactions/createTokenForNftPairTxn';
import { createDepositSolToPairTxn } from '../../utils/transactions/createDepositSolToPairTxn';
import { createPairTxn } from '../../utils/transactions/createPairTxn';
import { createDepositNftsToPairTxns } from '../../utils/transactions/createDepositNftsToPairTxns';
import { txsLoadingModalActions } from '../../state/txsLoadingModal/actions';
import { TxsLoadingModalTextStatus } from '../../state/txsLoadingModal/reducers';
import { notify } from '../../utils';
import { NotifyType } from '../../utils/solanaUtils';
import { useDispatch } from 'react-redux';
import { useConnection } from '../../hooks';
import { Nft } from '../../state/core/types';
import { captureSentryError } from '../../utils/sentry';
import { createDepositLiquidityOnlyBuyOrdersTxns } from '../../utils/transactions/createDepositLiquidityOnlyBuyOrdersTxns';
import { createDepositLiquidityOnlySellOrdersTxns } from '../../utils/transactions/createDepositLiquidityOnlySellOrdersTxns';
import { signAndSendAllTransactions } from '../../utils/transactions/helpers/signAndSendAllTransactions';

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
      await createAndSendTxn({
        connection,
        wallet,
        txInstructions: firstTxnData.transaction?.instructions,
        additionalSigners: firstTxnData.signers,
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

  const cards = amountPerChunk.map(() => {
    return createIxCardFuncs[IX_TYPE.ADD_BUY_ORDERS_TO_POOL_NO_SOL_AMOUNT]();
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
  const nftsToDepositWithBuyOrders = [];

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

  const restTxnsCards = restTxns.map((_, idx) =>
    selectedNfts[idx]
      ? createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_NFT_FROM_POOL](
          selectedNfts?.[idx],
          false,
        )
      : createIxCardFuncs[IX_TYPE.ADD_BUY_ORDERS_TO_POOL_NO_SOL_AMOUNT](),
  );

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
