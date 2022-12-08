import { useDispatch } from 'react-redux';
import { hadeswap } from 'hadeswap-sdk';
import {
  BondingCurveType,
  OrderType,
  PairType,
} from 'hadeswap-sdk/lib/hadeswap-core/types';
import { createModifyPairTxn } from '../../../utils/transactions/createModifyPairTxn';
import {
  createIxCardFuncs,
  IX_TYPE,
} from '../../../components/TransactionsLoadingModal';
import {
  getArrayByNumber,
  signAndSendAllTransactions,
} from '../../../utils/transactions';
import { createDepositSolToPairTxn } from '../../../utils/transactions/createDepositSolToPairTxn';
import { createWithdrawSolFromPairTxn } from '../../../utils/transactions/createWithdrawSolFromPairTxn';
import { createDepositNftsToPairTxns } from '../../../utils/transactions/createDepositNftsToPairTxns';
import { createWithdrawNftsFromPairTxns } from '../../../utils/transactions/createWithdrawNftsFromPairTxns';
import { chunk, differenceBy } from 'lodash';
import { createDepositLiquidityToPairTxns } from '../../../utils/transactions/createDepositLiquidityToPairTxns';
import { createWithdrawLiquidityFromPairTxns } from '../../../utils/transactions/createWithdrawLiquidityFromPairTxns';
import { createWithdrawLiquidityFromBuyOrdersPair } from '../../../utils/transactions/createWithdrawLiquidityFromBuyOrdersPairTxn';
import { createWithdrawLiquidityFromSellOrdersPair } from '../../../utils/transactions/createWithdrawLiquidityFromSellOrdersPairTxn';
import { txsLoadingModalActions } from '../../../state/txsLoadingModal/actions';
import { TxsLoadingModalTextStatus } from '../../../state/txsLoadingModal/reducers';
import { notify } from '../../../utils';
import { NotifyType } from '../../../utils/solanaUtils';
import { Nft, Pair } from '../../../state/core/types';
import { useConnection } from '../../../hooks';
import { useWallet } from '@solana/wallet-adapter-react';
import { useHistory } from 'react-router-dom';

interface UseSaveClick {
  pool: Pair;
  curveType: BondingCurveType;
  fee: number;
  nftAmount: number;
  pairType: PairType;
  selectedNfts: Nft[];
  buyOrdersAmount: number;
  rawSpotPrice: number;
  rawDelta: number;
  spotPrice: number;
}

export const useSaveClick = ({
  pool,
  curveType,
  fee,
  nftAmount,
  pairType,
  selectedNfts,
  buyOrdersAmount,
  rawSpotPrice,
  rawDelta,
  spotPrice,
}: UseSaveClick): {
  onSaveClick: () => Promise<void>;
  isSaveButtonDisabled: boolean;
} => {
  const dispatch = useDispatch();
  const history = useHistory();
  const connection = useConnection();
  const wallet = useWallet();

  const rawFee = fee * 100;

  const isLiquidityProvisionPool = pairType === PairType.LiquidityProvision;
  const isNftForTokenPool = pairType === PairType.NftForToken;
  const isTokenForNFTPool = pairType === PairType.TokenForNFT;

  const isPricingChanged =
    pool?.currentSpotPrice !== rawSpotPrice ||
    pool?.delta !== rawDelta ||
    (isLiquidityProvisionPool && pool?.fee !== rawFee);

  const nftsToDelete = differenceBy(pool?.sellOrders, selectedNfts, 'mint');
  const nftsToAdd = selectedNfts.filter((nft) => !nft.nftPairBox);

  const isTokenForNftChanged =
    pool?.buyOrdersAmount !== (nftAmount ?? pool?.buyOrdersAmount);
  const isLiquidityProvisionChanged = pool?.buyOrdersAmount !== buyOrdersAmount;

  const isNftForTokenChanged = nftsToDelete.length || nftsToAdd.length;

  const isChanged = isLiquidityProvisionPool
    ? isLiquidityProvisionChanged
    : isTokenForNftChanged;

  const isSaveButtonDisabled =
    !(isPricingChanged || isNftForTokenChanged || isChanged) || !spotPrice;

  const onSaveClick = async () => {
    const transactions = [];
    const cards = [];

    if (isPricingChanged) {
      const startingSpotPrice = hadeswap.helpers.calculateNextSpotPrice({
        orderType: OrderType.Buy,
        delta: rawDelta,
        bondingCurveType: pool?.bondingCurve as BondingCurveType,
        spotPrice: rawSpotPrice,
        counter: -pool?.mathCounter - 1,
      });

      transactions.push(
        await createModifyPairTxn({
          connection,
          wallet,
          pairPubkey: pool.pairPubkey,
          authorityAdapter: pool.authorityAdapterPubkey,
          delta: rawDelta,
          spotPrice: startingSpotPrice,
          fee: rawFee,
        }),
      );

      cards.push([createIxCardFuncs[IX_TYPE.EDIT_POOL]()]);
    }

    if (isTokenForNFTPool) {
      if (isTokenForNftChanged) {
        if (pool?.buyOrdersAmount < nftAmount) {
          const amountOfOrders = getArrayByNumber(
            nftAmount - pool?.buyOrdersAmount,
            20,
          );

          for (const amount of amountOfOrders) {
            transactions.push(
              await createDepositSolToPairTxn({
                connection,
                wallet,
                pairPubkey: pool.pairPubkey,
                authorityAdapter: pool.authorityAdapterPubkey,
                amountOfOrders: amount,
              }),
            );
          }

          const sellAmounts = hadeswap.helpers.calculatePricesArray({
            starting_spot_price: rawSpotPrice,
            delta: rawDelta,
            amount: nftAmount - pool?.buyOrdersAmount,
            bondingCurveType: curveType,
            orderType: OrderType.Sell,
            counter: pool?.buyOrdersAmount * -1 + 1,
          });

          cards.push([
            createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_SOL_FROM_POOL](
              sellAmounts.total,
            ),
          ]);

          //TODO: FIX
          for (let i = 0; i < transactions.length - 1; i++) {
            cards.push([createIxCardFuncs[IX_TYPE.EDIT_POOL]()]);
          }
        } else {
          const amountOfOrders = getArrayByNumber(
            pool?.buyOrdersAmount - nftAmount,
            20,
          );

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
            amount: pool?.buyOrdersAmount - nftAmount,
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
        }
      }
    } else if (isNftForTokenPool) {
      const addTxns = await createDepositNftsToPairTxns({
        connection,
        wallet,
        pairPubkey: pool.pairPubkey,
        authorityAdapter: pool.authorityAdapterPubkey,
        nfts: nftsToAdd,
      });

      const deleteTxns = await createWithdrawNftsFromPairTxns({
        connection,
        wallet,
        pairPubkey: pool.pairPubkey,
        authorityAdapter: pool.authorityAdapterPubkey,
        nfts: nftsToDelete,
      });

      const nftAddCards = nftsToAdd.map((nft) =>
        createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_NFT_FROM_POOL](nft),
      );

      const nftRemoveCards = nftsToDelete.map((nft) =>
        createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_NFT_FROM_POOL](nft, true),
      );

      transactions.push(...addTxns);
      transactions.push(...deleteTxns);
      cards.push(
        ...chunk(nftAddCards, Math.round(nftAddCards.length / addTxns.length)),
      );
      cards.push(
        ...chunk(
          nftRemoveCards,
          Math.round(nftRemoveCards.length / deleteTxns.length),
        ),
      );
    } else if (isLiquidityProvisionPool) {
      const txns = await createDepositLiquidityToPairTxns({
        connection,
        wallet,
        pairPubkey: pool.pairPubkey,
        authorityAdapter: pool.authorityAdapterPubkey,
        nfts: nftsToAdd,
      });

      const sellAmounts = hadeswap.helpers.calculatePricesArray({
        starting_spot_price: rawSpotPrice,
        delta: rawDelta,
        amount: nftsToAdd.length,
        bondingCurveType: curveType,
        orderType: OrderType.Sell,
        counter: pool.mathCounter + pool?.buyOrdersAmount * -1 + 3,
      });

      const nftAddCards = nftsToAdd.map((nft, index) =>
        createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_LIQUIDITY_FROM_POOL](
          nft,
          sellAmounts.array[index],
        ),
      );

      transactions.push(...txns);
      cards.push(
        ...chunk(nftAddCards, Math.round(nftAddCards.length / txns.length)),
      );

      const buyAmounts = hadeswap.helpers.calculatePricesArray({
        starting_spot_price: rawSpotPrice,
        delta: rawDelta,
        amount: nftsToDelete.length,
        bondingCurveType: curveType,
        orderType: OrderType.Buy,
        counter: pool?.buyOrdersAmount * -1,
      });

      if (pool?.nftsCount > 0 && pool?.buyOrdersAmount > 0) {
        const { chunks: txns } = await createWithdrawLiquidityFromPairTxns({
          connection,
          wallet,
          pairPubkey: pool.pairPubkey,
          authorityAdapter: pool.authorityAdapterPubkey,
          nfts: nftsToDelete,
        });

        const nftRemoveCards = nftsToDelete.map((nft, index) =>
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
      } else if (pool?.nftsCount === 0 && pool?.buyOrdersAmount > 0) {
        if (isLiquidityProvisionChanged) {
          const ordersToDelete =
            pool.buyOrdersAmount - buyOrdersAmount || pool.buyOrdersAmount;

          transactions.push(
            ...(await createWithdrawLiquidityFromBuyOrdersPair({
              connection,
              wallet,
              pairPubkey: pool.pairPubkey,
              authorityAdapter: pool.authorityAdapterPubkey,
              buyOrdersAmountToDelete: ordersToDelete,
            })),
          );

          cards.push([
            createIxCardFuncs[IX_TYPE.REMOVE_BUY_ORDERS_FROM_POOL](
              ordersToDelete,
            ),
          ]);
        }
      } else if (pool?.nftsCount > 0 && pool?.buyOrdersAmount === 0) {
        const txns = await createWithdrawLiquidityFromSellOrdersPair({
          connection,
          wallet,
          pairPubkey: pool.pairPubkey,
          authorityAdapter: pool.authorityAdapterPubkey,
          nfts: nftsToDelete,
        });

        const nftRemoveCards = nftsToDelete.map((nft, index) =>
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

    const isSuccess = await signAndSendAllTransactions({
      connection,
      wallet,
      txnsAndSigners: transactions.map((txn) => ({
        transaction: txn.transaction,
        signers: txn.signers,
      })),
      onBeforeApprove: () => {
        dispatch(
          txsLoadingModalActions.setState({
            visible: true,
            cards: cards,
            amountOfTxs: transactions.length,
            currentTxNumber: transactions.length,
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
    });

    dispatch(txsLoadingModalActions.setVisible(false));

    if (isSuccess) {
      history.push(`/pools/${pool?.pairPubkey}`);
    }
  };

  return {
    onSaveClick,
    isSaveButtonDisabled,
  };
};
