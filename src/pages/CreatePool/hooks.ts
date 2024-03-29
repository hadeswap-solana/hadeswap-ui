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
import { createTokenForNftPairTxn } from '../../utils/transactions/createTokenForNftPairTxn';
import { createDepositSolToPairTxn } from '../../utils/transactions/createDepositSolToPairTxn';
import { createPairTxn } from '../../utils/transactions/createPairTxn';
import { createDepositNftsToPairTxns } from '../../utils/transactions/createDepositNftsToPairTxns';
import { txsLoadingModalActions } from '../../state/txsLoadingModal/actions';
import { notify } from '../../utils';
import { NotifyType } from '../../utils/solanaUtils';
import { useDispatch } from 'react-redux';
import { useConnection } from '../../hooks';
import { Nft } from '../../state/core/types';
import { createDepositLiquidityOnlyBuyOrdersTxns } from '../../utils/transactions/createDepositLiquidityOnlyBuyOrdersTxns';
import { createDepositLiquidityOnlySellOrdersTxns } from '../../utils/transactions/createDepositLiquidityOnlySellOrdersTxns';
import {
  getTxnsDataOneByOne,
  signAndSendTransactionsOneByOne,
  getTxnsDataSeries,
  signAndSendAllTransactionsInSeries,
} from '../../utils/transactions';

interface CreatePoolProps
  extends Omit<CreateTxnSplittedDataProps, 'connection' | 'wallet'> {
  signTimeout?: number;
}

type UseCreatePool = (props: CreatePoolProps) => {
  create: () => Promise<void>;
};

export const useCreatePool: UseCreatePool = ({
  pairType,
  buyOrdersAmount,
  marketPubkey,
  selectedNfts,
  curveType,
  rawSpotPrice,
  rawDelta,
  rawFee,
  isSupportSignAllTxns,
  onAfterTxn,
  signTimeout,
}) => {
  const dispatch = useDispatch();
  const connection = useConnection();
  const wallet = useWallet();

  const create = async () => {
    const splittedTxnsData = await (
      getCreateSplittedDataFunc[pairType] || getCreateSplittedDataFunc.DEFAULT
    )({
      pairType,
      buyOrdersAmount,
      marketPubkey,
      selectedNfts,
      curveType,
      rawSpotPrice,
      rawDelta,
      rawFee,
      isSupportSignAllTxns,
      onAfterTxn,
      connection,
      wallet,
    });

    if (!splittedTxnsData) return;

    const { firstTxnData, restTxnsData } = splittedTxnsData;
    const closeModal = () => dispatch(txsLoadingModalActions.setVisible(false));
    try {
      //? Run First Txn
      const txnsData = getTxnsDataOneByOne([firstTxnData], dispatch);
      await signAndSendTransactionsOneByOne({
        txnsData,
        connection,
        wallet,
        signTimeout,
        closeModal,
      });

      //? Run Rest Txn
      if (restTxnsData?.length) {
        if (isSupportSignAllTxns) {
          const txnsData = getTxnsDataSeries([restTxnsData], dispatch);
          await signAndSendAllTransactionsInSeries({
            txnsData,
            wallet,
            connection,
            closeModal,
          });
        } else {
          const txnsData = getTxnsDataOneByOne(restTxnsData, dispatch);
          await signAndSendTransactionsOneByOne({
            txnsData,
            connection,
            wallet,
            closeModal,
          });
        }
      }

      onAfterTxn?.();
    } catch (error) {
      notify({
        message: 'oops... something went wrong!',
        type: NotifyType.ERROR,
      });
    } finally {
      closeModal();
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
  isSupportSignAllTxns?: boolean;
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
