import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'hadeswap-sdk';
import {
  BondingCurveType,
  PairType,
} from 'hadeswap-sdk/lib/hadeswap-core/types';
import { differenceBy } from 'lodash';

import {
  createIxCardFuncs,
  IX_TYPE,
} from '../../../../components/TransactionsLoadingModal';
import { Nft, Pair } from '../../../../state/core/types';
import { createDepositNftsToPairTxns } from '../../../../utils/transactions/createDepositNftsToPairTxns';
import { createModifyPairTxn } from '../../../../utils/transactions/createModifyPairTxn';
import { createWithdrawNftsFromPairTxns } from '../../../../utils/transactions/createWithdrawNftsFromPairTxns';
import { createWithdrawSolFromPairTxn } from '../../../../utils/transactions/createWithdrawSolFromPairTxn';
import { createWithdrawLiquidityFromBuyOrdersPair } from '../../../../utils/transactions/createWithdrawLiquidityFromBuyOrdersPairTxn';
import { createWithdrawLiquidityFromSellOrdersPair } from '../../../../utils/transactions/createWithdrawLiquidityFromSellOrdersPairTxn';
import { TxnData } from '../../../../types/transactions';
import { createDepositSolToPairTxn } from '../../../../utils/transactions/createDepositSolToPairTxn';
import { createDepositLiquidityOnlyBuyOrdersTxns } from '../../../../utils/transactions/createDepositLiquidityOnlyBuyOrdersTxns';
import { createDepositLiquidityOnlySellOrdersTxns } from '../../../../utils/transactions/createDepositLiquidityOnlySellOrdersTxns';

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
  if (
    !pool ||
    pool?.baseSpotPrice === undefined ||
    pool?.currentSpotPrice === undefined ||
    rawSpotPrice === undefined ||
    rawSpotPrice === 0 ||
    pool?.delta === undefined ||
    rawDelta === undefined ||
    rawFee === undefined
  ) {
    return false;
  }

  const isLiquidityProvisionPool = pool?.type === PairType.LiquidityProvision;
  const spotPriceChanged =
    Math.abs(
      (pool?.bondingCurve === BondingCurveType.XYK
        ? pool?.baseSpotPrice
        : pool?.currentSpotPrice) - rawSpotPrice,
    ) > 100 && Math.abs(pool?.baseSpotPrice - rawSpotPrice) > 100;

  const deltaChanged =
    pool?.bondingCurve !== BondingCurveType.XYK &&
    Math.abs(pool?.delta - rawDelta) > 1;
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
  currentRawSpotPrice: number;
  rawFee: number;
  rawDelta: number;
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<TxnData>;
export const createModifyPairTxnData: CreateModifyPairTxnData = async ({
  pool,
  rawSpotPrice,
  currentRawSpotPrice,
  rawFee,
  rawDelta,
  connection,
  wallet,
}) => {
  const isSpotChangingWrong =
    (pool?.baseSpotPrice !== pool?.currentSpotPrice &&
      Math.abs(
        (pool?.bondingCurve === BondingCurveType.XYK
          ? pool?.baseSpotPrice
          : pool?.currentSpotPrice) - rawSpotPrice,
      ) <= 10000) ||
    rawSpotPrice === 0 ||
    !rawSpotPrice;

  if (isSpotChangingWrong) {
    throw Error(
      'Something is not right with the edit. pool: ' +
        JSON.stringify(pool, null, 2) +
        ', spot price: ' +
        rawSpotPrice,
    );
  }
  const isSpotNotChanged =
    Math.abs(pool?.currentSpotPrice - currentRawSpotPrice) <= 1000;

  const { transaction, signers } = await createModifyPairTxn({
    connection,
    wallet,
    pairPubkey: pool.pairPubkey,
    authorityAdapter: pool.authorityAdapterPubkey,
    delta: rawDelta,
    spotPrice: isSpotNotChanged ? pool.currentSpotPrice : currentRawSpotPrice,
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
  async ({ pool, withdrawOrdersAmount, connection, wallet }) => {
    const amountPerChunk = [withdrawOrdersAmount];

    const loadingModalCard =
      createIxCardFuncs[IX_TYPE.REMOVE_BUY_ORDERS_FROM_POOL_NO_SOL_AMOUNT]();

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
  async ({ pool, ordersAmount, connection, wallet }) => {
    const amountPerChunk = [ordersAmount];

    const loadingModalCard =
      createIxCardFuncs[IX_TYPE.ADD_BUY_ORDERS_TO_POOL_NO_SOL_AMOUNT]();

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
    connection,
    wallet,
  }) => {
    const nftsToWithdraw = withdrawAll ? pool?.sellOrders : withdrawableNfts;
    const buyOrdersQuantityToWithdraw = withdrawAll
      ? pool?.buyOrdersAmount
      : withdrawableBuyOrders;
    const nftsToDeposit = withdrawAll ? [] : nftsToDepositOpt;
    const buyOrdersToDeposit = withdrawAll ? 0 : buyOrdersToDepositOpt;

    const unbalancedTxnsAndSigners = (
      nftsToWithdraw.length
        ? await createWithdrawLiquidityFromSellOrdersPair({
            connection,
            wallet,
            pairPubkey: pool.pairPubkey,
            authorityAdapter: pool.authorityAdapterPubkey,
            nfts: nftsToWithdraw,
          })
        : []
    ).concat(
      buyOrdersQuantityToWithdraw
        ? await createWithdrawLiquidityFromBuyOrdersPair({
            connection,
            wallet,
            pairPubkey: pool.pairPubkey,
            authorityAdapter: pool.authorityAdapterPubkey,
            buyOrdersAmountToDelete: buyOrdersQuantityToWithdraw,
          })
        : [],
    );

    const unbalancedTxnsData = unbalancedTxnsAndSigners.map(
      ({ transaction, signers }, idx) => ({
        transaction,
        signers,
        loadingModalCard:
          idx < nftsToWithdraw.length
            ? createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_NFT_FROM_POOL](
                nftsToWithdraw?.[idx],
                true,
              )
            : createIxCardFuncs[
                IX_TYPE.REMOVE_BUY_ORDERS_FROM_POOL_NO_SOL_AMOUNT
              ](),
      }),
    );

    let depositLiquidityTxnsData = [];

    if (buyOrdersToDeposit > 0) {
      depositLiquidityTxnsData = [
        ...depositLiquidityTxnsData,
        ...(await createDepositLiquidityOnlyBuyOrdersTxns({
          connection,
          wallet,
          pairPubkey: pool.pairPubkey,
          authorityAdapter: pool.authorityAdapterPubkey,
          buyOrdersAmount: buyOrdersToDeposit,
        })),
      ];
    }

    if (nftsToDeposit.length > 0) {
      depositLiquidityTxnsData = [
        ...depositLiquidityTxnsData,
        ...(await createDepositLiquidityOnlySellOrdersTxns({
          connection,
          wallet,
          pairPubkey: pool.pairPubkey,
          authorityAdapter: pool.authorityAdapterPubkey,
          nfts: nftsToDeposit,
        })),
      ];
    }

    const depositLiquidityTxnsDataWithCards = depositLiquidityTxnsData.map(
      ({ transaction, signers }, idx) => ({
        transaction,
        signers,
        loadingModalCard: nftsToDeposit[idx]
          ? createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_NFT_FROM_POOL](
              nftsToDeposit?.[idx],
              false,
            )
          : createIxCardFuncs[IX_TYPE.ADD_BUY_ORDERS_TO_POOL_NO_SOL_AMOUNT](),
      }),
    );

    return unbalancedTxnsData.concat(depositLiquidityTxnsDataWithCards);
  };

type BuildChangePoolTxnsData = (props: {
  pool: Pair;
  selectedNfts: Nft[];
  buyOrdersAmount: number;
  rawFee: number;
  rawSpotPrice: number;
  currentRawSpotPrice: number;

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
  currentRawSpotPrice,
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

  if (isPricingChanged && rawSpotPrice !== 0) {
    const modifyTxnData = await createModifyPairTxnData({
      pool,
      rawSpotPrice,
      currentRawSpotPrice,
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
