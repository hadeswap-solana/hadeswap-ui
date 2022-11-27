import { useDispatch } from 'react-redux';
import { createWithdrawLiquidityFeesTxns } from '../../../utils/transactions/createWithdrawLiquidityFeesTxns';
import {
  createIxCardFuncs,
  IX_TYPE,
} from '../../../components/TransactionsLoadingModal';
import { signAndSendTransactionsInSeries } from '../../../components/Layout/helpers';
import { txsLoadingModalActions } from '../../../state/txsLoadingModal/actions';
import { TxsLoadingModalTextStatus } from '../../../state/txsLoadingModal/reducers';
import { notify } from '../../../utils';
import { NotifyType } from '../../../utils/solanaUtils';
import { getArrayByNumber } from '../../../utils/transactions';
import { createWithdrawSolFromPairTxn } from '../../../utils/transactions/createWithdrawSolFromPairTxn';
import { hadeswap } from 'hadeswap-sdk';
import {
  BondingCurveType,
  OrderType,
  PairType,
} from 'hadeswap-sdk/lib/hadeswap-core/types';
import { createWithdrawNftsFromPairTxns } from '../../../utils/transactions/createWithdrawNftsFromPairTxns';
import { chunk } from 'lodash';
import { createWithdrawLiquidityFromPairTxns } from '../../../utils/transactions/createWithdrawLiquidityFromPairTxns';
import { createWithdrawLiquidityFromBuyOrdersPair } from '../../../utils/transactions/createWithdrawLiquidityFromBuyOrdersPairTxn';
import { createWithdrawLiquidityFromSellOrdersPair } from '../../../utils/transactions/createWithdrawLiquidityFromSellOrdersPairTxn';
import { useConnection } from '../../../hooks';
import { useWallet } from '@solana/wallet-adapter-react';
import { Pair } from '../../../state/core/types';
import { useHistory } from 'react-router-dom';

export const useWithdrawClick = ({
  pool,
}: {
  pool: Pair;
}): (() => Promise<void>) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const connection = useConnection();
  const wallet = useWallet();

  return async () => {
    const transactions = [];
    const cards = [];

    const txns = await createWithdrawLiquidityFeesTxns({
      connection,
      wallet,
      pairPubkey: pool.pairPubkey,
      authorityAdapter: pool.authorityAdapterPubkey,
      liquidityProvisionOrders: pool.liquidityProvisionOrders,
    });

    transactions.push(...txns);
    //TODO: FIX
    for (let i = 0; i < transactions.length; i++) {
      cards.push([createIxCardFuncs[IX_TYPE.WITHDRAW_FEES]()]);
    }

    const isSuccess = await signAndSendTransactionsInSeries({
      connection,
      wallet,
      txnData: transactions.map((txn, index) => ({
        signers: txn.signers,
        transaction: txn.transaction,
        onBeforeApprove: () => {
          dispatch(
            txsLoadingModalActions.setState({
              visible: true,
              cards: cards[index],
              amountOfTxs: transactions.length,
              currentTxNumber: 1 + index,
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
        onError: () => {
          notify({
            message: 'Transaction just failed for some reason',
            type: NotifyType.ERROR,
          });
        },
      })),
    });

    dispatch(txsLoadingModalActions.setVisible(false));

    if (isSuccess) {
      history.push(`/pools/${pool?.pairPubkey}`);
    }
  };
};

interface UseWithdrawAllClick {
  pool: Pair;
  pairType: PairType;
  rawSpotPrice: number;
  rawDelta: number;
  curveType: BondingCurveType;
}

export const useWithdrawAllClick = ({
  pool,
  pairType,
  rawSpotPrice,
  rawDelta,
  curveType,
}: UseWithdrawAllClick): (() => Promise<void>) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const connection = useConnection();
  const wallet = useWallet();

  const isLiquidityProvisionPool = pairType === PairType.LiquidityProvision;
  const isNftForTokenPool = pairType === PairType.NftForToken;
  const isTokenForNFTPool = pairType === PairType.TokenForNFT;

  return async () => {
    const transactions = [];
    const cards = [];

    if (isTokenForNFTPool) {
      const amountOfOrders = getArrayByNumber(pool?.buyOrdersAmount, 20);

      for (const amount of amountOfOrders) {
        transactions.push(
          await createWithdrawSolFromPairTxn({
            connection,
            wallet,
            pairPubkey: pool.pairPubkey,
            authorityAdapter: pool.authorityAdapterPubkey,
            amountOfOrders: amount,
          }),
        );
      }

      const buyAmounts = hadeswap.helpers.calculatePricesArray({
        starting_spot_price: rawSpotPrice,
        delta: rawDelta,
        amount: pool?.buyOrdersAmount,
        bondingCurveType: curveType,
        orderType: OrderType.Buy,
        counter: pool?.buyOrdersAmount * -1,
      });

      cards.push([
        createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_SOL_FROM_POOL](
          buyAmounts.total,
          true,
        ),
      ]);

      //TODO: FIX
      for (let i = 0; i < transactions.length - 1; i++) {
        cards.push([createIxCardFuncs[IX_TYPE.EDIT_POOL]()]);
      }
    } else if (isNftForTokenPool) {
      const deleteTxns = await createWithdrawNftsFromPairTxns({
        connection,
        wallet,
        pairPubkey: pool.pairPubkey,
        authorityAdapter: pool.authorityAdapterPubkey,
        nfts: pool?.sellOrders,
      });

      const nftRemoveCards = pool?.sellOrders.map((nft) =>
        createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_NFT_FROM_POOL](nft, true),
      );

      transactions.push(...deleteTxns);
      cards.push(
        ...chunk(
          nftRemoveCards,
          Math.round(nftRemoveCards.length / deleteTxns.length),
        ),
      );
    } else if (isLiquidityProvisionPool) {
      if (pool.liquidityProvisionOrders.length) {
        const buyAmounts = hadeswap.helpers.calculatePricesArray({
          starting_spot_price: rawSpotPrice,
          delta: rawDelta,
          amount: pool.sellOrders.length,
          bondingCurveType: curveType,
          orderType: OrderType.Buy,
          counter: ((pool?.nftsCount + pool?.buyOrdersAmount) / 2) * -1 - 1,
        });

        if (pool?.nftsCount > 0 && pool?.buyOrdersAmount > 0) {
          const balancedOrdersToWithdraw =
            pool.sellOrders.length < pool.buyOrdersAmount
              ? pool.sellOrders
              : pool.sellOrders.slice(0, pool.buyOrdersAmount);

          const { chunks: txns, takenLpOrders } =
            await createWithdrawLiquidityFromPairTxns({
              connection,
              wallet,
              pairPubkey: pool.pairPubkey,
              liquidityProvisionOrders: pool.liquidityProvisionOrders,
              authorityAdapter: pool.authorityAdapterPubkey,
              nfts: balancedOrdersToWithdraw,
            });

          const nftRemoveCards = balancedOrdersToWithdraw.map((nft, index) =>
            createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_LIQUIDITY_FROM_POOL](
              nft,
              buyAmounts.array[index],
              true,
            ),
          );

          transactions.push(...txns);
          cards.push(
            ...chunk(
              nftRemoveCards,
              Math.round(nftRemoveCards.length / txns.length),
            ),
          );

          if (pool.buyOrdersAmount > pool.nftsCount) {
            const amount = pool.buyOrdersAmount - pool.nftsCount;

            transactions.push(
              ...(await createWithdrawLiquidityFromBuyOrdersPair({
                connection,
                wallet,
                pairPubkey: pool.pairPubkey,
                liquidityProvisionOrders: pool.liquidityProvisionOrders.filter(
                  (order) =>
                    !takenLpOrders.includes(order.liquidityProvisionOrder),
                ),
                authorityAdapter: pool.authorityAdapterPubkey,
                buyOrdersAmountToDelete: amount,
              })),
            );

            cards.push([
              createIxCardFuncs[IX_TYPE.REMOVE_BUY_ORDERS_FROM_POOL](amount),
            ]);
          } else if (pool.buyOrdersAmount < pool.nftsCount) {
            const orders = pool.sellOrders.filter(
              (order) =>
                !balancedOrdersToWithdraw.find(
                  (balancedOrder) => order.mint === balancedOrder.mint,
                ),
            );

            const txns = await createWithdrawLiquidityFromSellOrdersPair({
              connection,
              wallet,
              pairPubkey: pool.pairPubkey,
              liquidityProvisionOrders: pool.liquidityProvisionOrders.filter(
                (order) =>
                  !takenLpOrders.includes(order.liquidityProvisionOrder),
              ),
              authorityAdapter: pool.authorityAdapterPubkey,
              nfts: orders,
            });

            const nftRemoveCards = orders.map((nft, index) =>
              createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_LIQUIDITY_FROM_POOL](
                nft,
                buyAmounts.array[index],
                true,
              ),
            );

            transactions.push(...txns);
            cards.push(
              ...chunk(
                nftRemoveCards,
                Math.round(nftRemoveCards.length / txns.length),
              ),
            );
          }
        } else if (pool?.nftsCount === 0 && pool?.buyOrdersAmount > 0) {
          const ordersToDelete = pool.buyOrdersAmount;

          transactions.push(
            ...(await createWithdrawLiquidityFromBuyOrdersPair({
              connection,
              wallet,
              pairPubkey: pool.pairPubkey,
              liquidityProvisionOrders: pool.liquidityProvisionOrders,
              authorityAdapter: pool.authorityAdapterPubkey,
              buyOrdersAmountToDelete: ordersToDelete,
            })),
          );

          cards.push([
            createIxCardFuncs[IX_TYPE.REMOVE_BUY_ORDERS_FROM_POOL](
              ordersToDelete,
            ),
          ]);
        } else if (pool?.nftsCount > 0 && pool?.buyOrdersAmount === 0) {
          const txns = await createWithdrawLiquidityFromSellOrdersPair({
            connection,
            wallet,
            pairPubkey: pool.pairPubkey,
            liquidityProvisionOrders: pool.liquidityProvisionOrders,
            authorityAdapter: pool.authorityAdapterPubkey,
            nfts: pool.sellOrders,
          });

          const nftRemoveCards = pool.sellOrders.map((nft, index) =>
            createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_LIQUIDITY_FROM_POOL](
              nft,
              buyAmounts.array[index],
              true,
            ),
          );

          transactions.push(...txns);
          cards.push(
            ...chunk(
              nftRemoveCards,
              Math.round(nftRemoveCards.length / txns.length),
            ),
          );
        }
      }
    }

    const isSuccess = await signAndSendTransactionsInSeries({
      connection,
      wallet,
      txnData: transactions.map((txn, index) => ({
        signers: txn.signers,
        transaction: txn.transaction,
        onBeforeApprove: () => {
          dispatch(
            txsLoadingModalActions.setState({
              visible: true,
              cards: cards[index],
              amountOfTxs: transactions.length,
              currentTxNumber: 1 + index,
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
        onError: () => {
          notify({
            message: 'Transaction just failed for some reason',
            type: NotifyType.ERROR,
          });
        },
      })),
    });

    dispatch(txsLoadingModalActions.setVisible(false));

    if (isSuccess) {
      history.push(`/pools/${pool?.pairPubkey}`);
    }
  };
};
