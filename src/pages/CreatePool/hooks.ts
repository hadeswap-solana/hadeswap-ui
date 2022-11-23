import { useWallet } from '@solana/wallet-adapter-react';
import { useHistory } from 'react-router-dom';
import {
  OrderType,
  PairType,
  BondingCurveType,
} from 'hadeswap-sdk/lib/hadeswap-core/types';
import { NftsModal } from '../../components/SelectNftsModal/SelectNftsModal';
import {
  createIxCardFuncs,
  IX_TYPE,
} from '../../components/TransactionsLoadingModal';
import { getArrayByNumber } from '../../utils/transactions';
import { createTokenForNftPairTxn } from '../../utils/transactions/createTokenForNftPairTxn';
import { createDepositSolToPairTxn } from '../../utils/transactions/createDepositSolToPairTxn';
import { hadeswap } from 'hadeswap-sdk';
import { createPairTxn } from '../../utils/transactions/createPairTxn';
import { createDepositNftsToPairTxns } from '../../utils/transactions/createDepositNftsToPairTxns';
import { chunk } from 'lodash';
import { createDepositLiquidityToPairTxns } from '../../utils/transactions/createDepositLiquidityToPairTxns';
import { signAndSendTransactionsInSeries } from '../../components/Layout/helpers';
import { txsLoadingModalActions } from '../../state/txsLoadingModal/actions';
import { TxsLoadingModalTextStatus } from '../../state/txsLoadingModal/reducers';
import { notify } from '../../utils';
import { NotifyType } from '../../utils/solanaUtils';
import { useDispatch } from 'react-redux';
import { useConnection } from '../../hooks';

interface UseOnCreatePoolClickProps {
  pairType: PairType;
  nftAmount: number;
  chosenMarketKey: string;
  nftModal: NftsModal;
  curveType: BondingCurveType;
  rawSpotPrice: number;
  rawDelta: number;
  rawFee: number;
}

export const useOnCreatePoolClick = ({
  pairType,
  nftAmount,
  chosenMarketKey,
  nftModal,
  curveType,
  rawSpotPrice,
  rawDelta,
  rawFee,
}: UseOnCreatePoolClickProps): (() => Promise<void>) => {
  const dispatch = useDispatch();
  const connection = useConnection();
  const wallet = useWallet();
  const history = useHistory();

  return async () => {
    const transactions = [];
    const cards = [[createIxCardFuncs[IX_TYPE.CREATE_EMPTY_POOL]()]];

    if (pairType === PairType.TokenForNFT) {
      const nftAmounts = getArrayByNumber(nftAmount, 20);
      const firstAmount = nftAmounts.shift();

      const createTransaction = await createTokenForNftPairTxn({
        connection,
        wallet,
        marketPubkey: chosenMarketKey,
        bondingCurveType: curveType,
        pairType: PairType.TokenForNFT,
        delta: rawDelta,
        spotPrice: rawSpotPrice,
        amountOfOrders: firstAmount,
      });

      transactions.push(createTransaction);

      for (const amount of nftAmounts) {
        transactions.push(
          await createDepositSolToPairTxn({
            connection,
            wallet,
            pairPubkey: createTransaction.pairPubkey.toBase58(),
            authorityAdapter:
              createTransaction.authorityAdapterPubkey.toBase58(),
            amountOfOrders: amount,
          }),
        );
      }

      const amounts = hadeswap.helpers.calculatePricesArray({
        starting_spot_price: rawSpotPrice,
        delta: rawDelta,
        amount: nftAmount,
        bondingCurveType: curveType,
        orderType: OrderType.Sell,
        counter: 1,
      });

      cards[0].push(
        createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_SOL_FROM_POOL](amounts.total),
      );

      //TODO: FIX
      for (let i = 0; i < transactions.length - 1; i++) {
        cards.push([createIxCardFuncs[IX_TYPE.EDIT_POOL]()]);
      }
    } else {
      const pairTxn = await createPairTxn({
        connection,
        wallet,
        marketPubkey: chosenMarketKey,
        bondingCurveType: curveType,
        pairType:
          pairType === PairType.NftForToken
            ? PairType.NftForToken
            : PairType.LiquidityProvision,
        delta: rawDelta,
        spotPrice: rawSpotPrice,
        fee: rawFee,
      });

      transactions.push(pairTxn);

      if (pairType === PairType.NftForToken) {
        const txns = await createDepositNftsToPairTxns({
          connection,
          wallet,
          pairPubkey: pairTxn.pairPubkey,
          authorityAdapter: pairTxn.authorityAdapterPubkey,
          nfts: nftModal.selectedNfts,
        });

        const nftCards = nftModal.selectedNfts.map((nft) =>
          createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_NFT_FROM_POOL](nft),
        );

        transactions.push(...txns);
        cards.push(
          ...chunk(nftCards, Math.round(nftCards.length / txns.length)),
        );
      } else if (pairType === PairType.LiquidityProvision) {
        const txns = await createDepositLiquidityToPairTxns({
          connection,
          wallet,
          pairPubkey: pairTxn.pairPubkey,
          authorityAdapter: pairTxn.authorityAdapterPubkey,
          nfts: nftModal.selectedNfts,
        });

        const sellAmounts = hadeswap.helpers.calculatePricesArray({
          starting_spot_price: rawSpotPrice,
          delta: rawDelta,
          amount: nftModal.selectedNfts.length,
          bondingCurveType: curveType,
          orderType: OrderType.Sell,
          counter: 1,
        });

        const nftCards = nftModal.selectedNfts.map((nft, index) =>
          createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_LIQUIDITY_FROM_POOL](
            nft,
            sellAmounts.array[index],
          ),
        );

        transactions.push(...txns);
        cards.push(
          ...chunk(nftCards, Math.round(nftCards.length / txns.length)),
        );
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
      history.push('/my-pools');
    }
  };
};
