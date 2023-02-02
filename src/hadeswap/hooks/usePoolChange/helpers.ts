import { WalletContextState } from '@solana/wallet-adapter-react';
import { hadeswap, web3 } from 'hadeswap-sdk';
import {
  BondingCurveType,
  OrderType,
  PairType,
} from 'hadeswap-sdk/lib/hadeswap-core/types';
import { min, differenceBy } from 'lodash';

import { SOL_WITHDRAW_ORDERS_LIMIT__PER_TXN } from '../..';
import {
  createIxCardFuncs,
  IX_TYPE,
} from '../../../components/TransactionsLoadingModal';
import { Nft, Pair } from '../../../state/core/types';
import { getArrayByNumber } from '../../../utils/transactions';
import { createDepositLiquidityToPairTxns } from '../../../utils/transactions/createDepositLiquidityToPairTxns';
import { createDepositNftsToPairTxns } from '../../../utils/transactions/createDepositNftsToPairTxns';
import { createModifyPairTxn } from '../../../utils/transactions/createModifyPairTxn';
import { createWithdrawLiquidityFromPairTxns } from '../../../utils/transactions/createWithdrawLiquidityFromPairTxns';
import { createWithdrawNftsFromPairTxns } from '../../../utils/transactions/createWithdrawNftsFromPairTxns';
import { createWithdrawSolFromPairTxn } from '../../../utils/transactions/createWithdrawSolFromPairTxn';
import { createWithdrawLiquidityFromBuyOrdersPair } from '../../../utils/transactions/createWithdrawLiquidityFromBuyOrdersPairTxn';
import { createWithdrawLiquidityFromSellOrdersPair } from '../../../utils/transactions/createWithdrawLiquidityFromSellOrdersPairTxn';
import { TxnData } from './types';
import { createDepositSolToPairTxn } from '../../../utils/transactions/createDepositSolToPairTxn';
import { createDepositLiquidityOnlyBuyOrdersTxns } from '../../../utils/transactions/createDepositLiquidityOnlyBuyOrdersTxns';
import { createDepositLiquidityOnlySellOrdersTxns } from '../../../utils/transactions/createDepositLiquidityOnlySellOrdersTxns';

type CheckIsPricingChanged = (props: {
  pool: Pair;
  rawSpotPrice: number;
  rawFee: number;
  rawDelta: number;
}) => boolean;
export const checkIsPricingChanged: CheckIsPricingChanged = ({
  pool,
  rawSpotPrice,
  rawFee,
  rawDelta,
}) => {
  const isLiquidityProvisionPool = pool?.type === PairType.LiquidityProvision;
  const spotPriceChanged =
    Math.abs(
      (pool?.bondingCurve === BondingCurveType.XYK
        ? pool?.baseSpotPrice
        : pool?.currentSpotPrice) - rawSpotPrice,
    ) > 100;

  const deltaChanged = Math.abs(pool?.delta - rawDelta) > 1;
  const feeChanged = isLiquidityProvisionPool && pool?.fee !== rawFee;

  return spotPriceChanged || deltaChanged || feeChanged;
};

type CheckIsPoolChanged = (props: {
  pool: Pair;
  selectedNfts: Nft[];
  rawFee: number;
  rawSpotPrice: number;
  rawDelta: number;
  buyOrdersAmount: number;
}) => boolean;
export const checkIsPoolChanged: CheckIsPoolChanged = ({
  pool,
  rawSpotPrice,
  rawFee,
  rawDelta,
  selectedNfts,
  buyOrdersAmount,
}) => {
  const isPricingChanged = checkIsPricingChanged({
    pool,
    rawSpotPrice,
    rawFee,
    rawDelta,
  });

  const buyOrdersAmountChanged = pool?.buyOrdersAmount !== buyOrdersAmount;

  const nftsToRemove = differenceBy(
    pool?.sellOrders,
    selectedNfts,
    'mint',
  ) as Nft[];
  const nftsToDeposit = selectedNfts.filter((nft) => !nft.nftPairBox);

  return !!(
    nftsToRemove?.length ||
    nftsToDeposit?.length ||
    isPricingChanged ||
    buyOrdersAmountChanged
  );
};

type CreateModifyPairTxnData = (props: {
  pool: Pair;
  rawSpotPrice: number;
  rawFee: number;
  rawDelta: number;
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<TxnData>;
export const createModifyPairTxnData: CreateModifyPairTxnData = async ({
  pool,
  rawSpotPrice,
  rawFee,
  rawDelta,
  connection,
  wallet,
}) => {
  const { transaction, signers } = await createModifyPairTxn({
    connection,
    wallet,
    pairPubkey: pool.pairPubkey,
    authorityAdapter: pool.authorityAdapterPubkey,
    delta: rawDelta,
    spotPrice: rawSpotPrice,
    fee: rawFee,
  });

  return {
    transaction,
    signers,
    loadingModalCard: createIxCardFuncs[IX_TYPE.EDIT_POOL](),
  };
};

type CreateWithdrawSOLFromPairTxnsData = (props: {
  pool: Pair;
  rawSpotPrice: number;
  rawDelta: number;
  withdrawOrdersAmount: number;
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<TxnData[]>;
export const createWithdrawSOLFromPairTxnsData: CreateWithdrawSOLFromPairTxnsData =
  async ({
    pool,
    rawSpotPrice,
    rawDelta,
    withdrawOrdersAmount,
    connection,
    wallet,
  }) => {
    const amountPerChunk = getArrayByNumber(
      withdrawOrdersAmount,
      SOL_WITHDRAW_ORDERS_LIMIT__PER_TXN,
    );

    const { total: withdrawAmount } = hadeswap.helpers.calculatePricesArray({
      starting_spot_price: rawSpotPrice,
      delta: rawDelta,
      amount: withdrawOrdersAmount,
      bondingCurveType: pool.bondingCurve,
      orderType: OrderType.Buy,
      counter: pool?.buyOrdersAmount * -1,
    });

    const loadingModalCard = createIxCardFuncs[
      IX_TYPE.ADD_OR_REMOVE_SOL_FROM_POOL
    ](withdrawAmount, true);

    const txnsAndSigners = await Promise.all(
      amountPerChunk.map((amount) =>
        createWithdrawSolFromPairTxn({
          connection,
          wallet,
          pairPubkey: pool.pairPubkey,
          authorityAdapter: pool.authorityAdapterPubkey,
          amountOfOrders: amount,
        }),
      ),
    );

    return txnsAndSigners.map(({ transaction, signers }, idx) => ({
      transaction,
      signers,
      loadingModalCard: idx === 0 ? loadingModalCard : null,
    }));
  };

type CreateDepositSOLToPairTxnsData = (props: {
  pool: Pair;
  rawSpotPrice: number;
  rawDelta: number;
  ordersAmount: number;
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<TxnData[]>;
export const createDepositSOLToPairTxnsData: CreateDepositSOLToPairTxnsData =
  async ({
    pool,
    rawSpotPrice,
    rawDelta,
    ordersAmount,
    connection,
    wallet,
  }) => {
    const amountPerChunk = getArrayByNumber(
      ordersAmount,
      SOL_WITHDRAW_ORDERS_LIMIT__PER_TXN,
    );

    const { total: depositAmount } = hadeswap.helpers.calculatePricesArray({
      starting_spot_price: rawSpotPrice,
      delta: rawDelta,
      amount: ordersAmount,
      bondingCurveType: pool.bondingCurve,
      orderType: OrderType.Buy,
      counter: pool?.buyOrdersAmount * -1,
    });

    const loadingModalCard =
      createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_SOL_FROM_POOL](depositAmount);

    const txnsAndSigners = await Promise.all(
      amountPerChunk.map((amount) =>
        createDepositSolToPairTxn({
          connection,
          wallet,
          pairPubkey: pool.pairPubkey,
          authorityAdapter: pool.authorityAdapterPubkey,
          amountOfOrders: amount,
        }),
      ),
    );

    return txnsAndSigners.map(({ transaction, signers }, idx) => ({
      transaction,
      signers,
      loadingModalCard: idx === 0 ? loadingModalCard : null,
    }));
  };

type CreateWithdrawNftsFromPairTxnsData = (props: {
  pool: Pair;
  withdrawableNfts: Nft[];
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<TxnData[]>;
export const createWithdrawNftsFromPairTxnsData: CreateWithdrawNftsFromPairTxnsData =
  async ({ pool, withdrawableNfts, connection, wallet }) => {
    const txnsAndSigners = await createWithdrawNftsFromPairTxns({
      connection,
      wallet,
      pairPubkey: pool.pairPubkey,
      authorityAdapter: pool.authorityAdapterPubkey,
      nfts: withdrawableNfts,
    });

    return txnsAndSigners.map(({ transaction, signers }, idx) => ({
      transaction,
      signers,
      loadingModalCard: createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_NFT_FROM_POOL](
        withdrawableNfts[idx],
        true,
      ),
    }));
  };

type CreateDepositNftsToPairTxnsData = (props: {
  pool: Pair;
  nftsToDeposit: Nft[];
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<TxnData[]>;
export const createDepositNftsToPairTxnsData: CreateDepositNftsToPairTxnsData =
  async ({ pool, nftsToDeposit, connection, wallet }) => {
    const txnsAndSigners = await createDepositNftsToPairTxns({
      connection,
      wallet,
      pairPubkey: pool.pairPubkey,
      authorityAdapter: pool.authorityAdapterPubkey,
      nfts: nftsToDeposit,
    });

    return txnsAndSigners.map(({ transaction, signers }, idx) => ({
      transaction,
      signers,
      loadingModalCard: createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_NFT_FROM_POOL](
        nftsToDeposit[idx],
      ),
    }));
  };

type CreateWithdrawAndDepositLiquidityFromPairTxnsData = (props: {
  pool: Pair;
  withdrawableNfts?: Nft[];
  withdrawableBuyOrders?: number;

  nftsToDepositOpt?: Nft[];
  buyOrdersToDepositOpt?: number;
  withdrawAll?: boolean;
  rawSpotPrice: number;
  rawDelta: number;
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<TxnData[]>;
export const createWithdrawAndDepositLiquidityFromPairTxnsData: CreateWithdrawAndDepositLiquidityFromPairTxnsData =
  async ({
    pool,
    withdrawableNfts,
    withdrawableBuyOrders,
    nftsToDepositOpt,
    buyOrdersToDepositOpt,
    withdrawAll = false,
    rawSpotPrice,
    rawDelta,
    connection,
    wallet,
  }) => {
    const nftsToWithdraw = withdrawAll ? pool?.sellOrders : withdrawableNfts;
    const buyOrdersQuantityToWithdraw = withdrawAll
      ? pool?.buyOrdersAmount
      : withdrawableBuyOrders;
    const nftsToDeposit = withdrawAll ? [] : nftsToDepositOpt;
    const buyOrdersToDeposit = withdrawAll ? 0 : buyOrdersToDepositOpt;

    const { array: solAmounts } = hadeswap.helpers.calculatePricesArray({
      starting_spot_price: rawSpotPrice,
      delta: rawDelta,
      amount: nftsToWithdraw?.length,
      bondingCurveType: pool.bondingCurve,
      orderType: OrderType.Buy,
      counter: ((pool.nftsCount + pool.buyOrdersAmount) / 2) * -1 - 1,
    });

    const balancedPairsAmount = min([
      nftsToWithdraw.length,
      buyOrdersQuantityToWithdraw,
    ]);

    const sellOrdersToWithdraw = nftsToWithdraw.slice(
      balancedPairsAmount,
      nftsToWithdraw.length,
    );

    const buyOrdersToWithdraw =
      buyOrdersQuantityToWithdraw > nftsToWithdraw.length
        ? buyOrdersQuantityToWithdraw - nftsToWithdraw.length
        : 0;

    const balancedNfts = nftsToWithdraw.slice(0, balancedPairsAmount);

    const { chunks: balancedTxnsAndSigners } =
      await createWithdrawLiquidityFromPairTxns({
        connection,
        wallet,
        pairPubkey: pool.pairPubkey,
        authorityAdapter: pool.authorityAdapterPubkey,
        nfts: balancedNfts,
      });

    const balancedTxnsData = balancedTxnsAndSigners.map(
      ({ transaction, signers }, idx) => ({
        transaction,
        signers,
        loadingModalCard: createIxCardFuncs[
          IX_TYPE.ADD_OR_REMOVE_LIQUIDITY_FROM_POOL
        ](balancedNfts[idx], solAmounts[idx], true),
      }),
    );

    const unbalancedOrdersAmount =
      sellOrdersToWithdraw.length || buyOrdersToWithdraw;

    const unbalancedTxnsAndSigners = unbalancedOrdersAmount
      ? await (sellOrdersToWithdraw.length
          ? createWithdrawLiquidityFromSellOrdersPair({
              connection,
              wallet,
              pairPubkey: pool.pairPubkey,
              authorityAdapter: pool.authorityAdapterPubkey,
              nfts: sellOrdersToWithdraw,
            })
          : createWithdrawLiquidityFromBuyOrdersPair({
              connection,
              wallet,
              pairPubkey: pool.pairPubkey,
              authorityAdapter: pool.authorityAdapterPubkey,
              buyOrdersAmountToDelete: buyOrdersToWithdraw,
            }))
      : [];

    const balancedTxnsAmount = balancedTxnsAndSigners?.length || 0;

    const unbalancedTxnsData = unbalancedTxnsAndSigners.map(
      ({ transaction, signers }, idx) => ({
        transaction,
        signers,
        loadingModalCard: sellOrdersToWithdraw.length
          ? createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_LIQUIDITY_FROM_POOL](
              nftsToWithdraw?.[idx + balancedNfts?.length],
              solAmounts?.[idx + balancedTxnsAmount],
              true,
            )
          : createIxCardFuncs[IX_TYPE.REMOVE_BUY_ORDERS_FROM_POOL](
              solAmounts?.[idx + balancedTxnsAmount],
            ),
      }),
    );

    const amountOfBuyAndSellOrderPairs = Math.min(
      buyOrdersToDeposit,
      nftsToDeposit.length,
    );
    const nftsToDepositWithBuyOrders = nftsToDeposit.slice(
      0,
      amountOfBuyAndSellOrderPairs,
    );

    let depositLiquidityTxnsData = [];

    if (nftsToDepositWithBuyOrders.length > 0) {
      depositLiquidityTxnsData = await createDepositLiquidityToPairTxns({
        connection,
        wallet,
        pairPubkey: pool.pairPubkey,
        authorityAdapter: pool.authorityAdapterPubkey,
        nfts: nftsToDepositWithBuyOrders,
      });
    }

    const outstandingBuyOrders =
      buyOrdersToDeposit - nftsToDepositWithBuyOrders.length;

    if (outstandingBuyOrders > 0) {
      depositLiquidityTxnsData = [
        ...depositLiquidityTxnsData,
        ...(await createDepositLiquidityOnlyBuyOrdersTxns({
          connection,
          wallet,
          pairPubkey: pool.pairPubkey,
          authorityAdapter: pool.authorityAdapterPubkey,
          buyOrdersAmount: outstandingBuyOrders,
        })),
      ];
    }

    const outstandingNfts = nftsToDeposit.slice(
      nftsToDepositWithBuyOrders.length,
      nftsToDeposit.length,
    );

    if (outstandingNfts.length > 0) {
      depositLiquidityTxnsData = [
        ...depositLiquidityTxnsData,
        ...(await createDepositLiquidityOnlySellOrdersTxns({
          connection,
          wallet,
          pairPubkey: pool.pairPubkey,
          authorityAdapter: pool.authorityAdapterPubkey,
          nfts: outstandingNfts,
        })),
      ];
    }

    return balancedTxnsData
      .concat(unbalancedTxnsData)
      .concat(depositLiquidityTxnsData);
  };

type BuildChangePoolTxnsData = (props: {
  pool: Pair;
  selectedNfts: Nft[];
  buyOrdersAmount: number;
  rawFee: number;
  rawSpotPrice: number;
  rawDelta: number;
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<TxnData[][]>;
export const buildChangePoolTxnsData: BuildChangePoolTxnsData = async ({
  pool,
  selectedNfts,
  buyOrdersAmount,
  rawFee,
  rawDelta,
  rawSpotPrice,
  wallet,
  connection,
}) => {
  const txnsData: TxnData[][] = [];
  const isTokenForNFTPool = pool.type === PairType.TokenForNFT;
  const isNftForTokenPool = pool.type === PairType.NftForToken;
  const isLiquidityProvisionPool = pool.type === PairType.LiquidityProvision;

  const nftsToRemove = differenceBy(pool?.sellOrders, selectedNfts, 'mint');
  const nftsToDeposit = selectedNfts.filter((nft) => !nft.nftPairBox);

  const isPricingChanged = checkIsPricingChanged({
    pool,
    rawSpotPrice,
    rawFee,
    rawDelta,
  });

  //! Pair modification transaction logic
  //? Ignore when somehow rawSpotPrice === 0
  if (isPricingChanged && rawSpotPrice !== 0) {
    const modifyTxnData = await createModifyPairTxnData({
      pool,
      rawSpotPrice,
      rawFee,
      rawDelta,
      connection,
      wallet,
    });
    txnsData.push([modifyTxnData]);
  }

  //! Remove liquidity transactions:
  //? Buy
  if (isTokenForNFTPool && buyOrdersAmount < pool.buyOrdersAmount) {
    const withdrawSOLTxnsData = await createWithdrawSOLFromPairTxnsData({
      pool,
      rawSpotPrice,
      rawDelta,
      withdrawOrdersAmount: pool.buyOrdersAmount - buyOrdersAmount,
      connection,
      wallet,
    });
    txnsData.push(withdrawSOLTxnsData);
  }
  //? Sell
  if (isNftForTokenPool && !!nftsToRemove.length) {
    const withdrawNftsTxnsData = await createWithdrawNftsFromPairTxnsData({
      pool,
      withdrawableNfts: nftsToRemove,
      connection,
      wallet,
    });
    txnsData.push(withdrawNftsTxnsData);
  }
  //? Liquidty
  if (
    isLiquidityProvisionPool &&
    (!!nftsToRemove.length ||
      pool.buyOrdersAmount - buyOrdersAmount > 0 ||
      !!nftsToDeposit.length ||
      buyOrdersAmount - pool.buyOrdersAmount > 0)
  ) {
    const withdrawAndDepositLiquidityTxnsData =
      await createWithdrawAndDepositLiquidityFromPairTxnsData({
        pool,
        withdrawableNfts: nftsToRemove,
        withdrawableBuyOrders: Math.max(
          pool.buyOrdersAmount - buyOrdersAmount,
          0,
        ),
        nftsToDepositOpt: nftsToDeposit,
        buyOrdersToDepositOpt: Math.max(
          buyOrdersAmount - pool.buyOrdersAmount,
          0,
        ),
        rawSpotPrice,
        rawDelta,
        connection,
        wallet,
      });

    withdrawAndDepositLiquidityTxnsData.length &&
      txnsData.push(withdrawAndDepositLiquidityTxnsData);
  }

  //! Add liquidity transactions
  //? Buy
  if (isTokenForNFTPool && pool.buyOrdersAmount < buyOrdersAmount) {
    const depositSOLTxnsData = await createDepositSOLToPairTxnsData({
      pool,
      rawSpotPrice,
      rawDelta,
      ordersAmount: buyOrdersAmount - pool.buyOrdersAmount,
      connection,
      wallet,
    });
    txnsData.push(depositSOLTxnsData);
  }

  //? Sell
  if (isNftForTokenPool && !!nftsToDeposit.length) {
    const depositNftsTxnsData = await createDepositNftsToPairTxnsData({
      pool,
      nftsToDeposit,
      connection,
      wallet,
    });
    txnsData.push(depositNftsTxnsData);
  }

  return txnsData;
};

type BuildWithdrawAllLiquidityFromPoolTxnsData = (props: {
  pool: Pair;
  rawSpotPrice: number;
  rawDelta: number;
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<TxnData[][]>;
export const buildWithdrawAllLiquidityFromPoolTxnsData: BuildWithdrawAllLiquidityFromPoolTxnsData =
  async ({ pool, rawDelta, rawSpotPrice, wallet, connection }) => {
    const txnsData: TxnData[][] = [];

    const isTokenForNFTPool = pool.type === PairType.TokenForNFT;
    const isNftForTokenPool = pool.type === PairType.NftForToken;
    const isLiquidityProvisionPool = pool.type === PairType.LiquidityProvision;

    //? Buy
    if (isTokenForNFTPool) {
      const withdrawSOLTxnsData = await createWithdrawSOLFromPairTxnsData({
        pool,
        rawSpotPrice,
        rawDelta,
        withdrawOrdersAmount: pool.buyOrdersAmount,
        connection,
        wallet,
      });
      txnsData.push(withdrawSOLTxnsData);
    }
    //? Sell
    if (isNftForTokenPool && !!pool?.sellOrders.length) {
      const withdrawNftsTxnsData = await createWithdrawNftsFromPairTxnsData({
        pool,
        withdrawableNfts: pool?.sellOrders,
        connection,
        wallet,
      });
      txnsData.push(withdrawNftsTxnsData);
    }
    //? Liquidty
    if (
      isLiquidityProvisionPool &&
      (!!pool?.sellOrders.length || !!pool?.buyOrdersAmount)
    ) {
      const withdrawAndDepositLiquidityTxnsData =
        await createWithdrawAndDepositLiquidityFromPairTxnsData({
          pool,
          withdrawAll: true,
          rawSpotPrice,
          rawDelta,
          connection,
          wallet,
        });

      withdrawAndDepositLiquidityTxnsData.length &&
        txnsData.push(withdrawAndDepositLiquidityTxnsData);
    }

    return txnsData;
  };
