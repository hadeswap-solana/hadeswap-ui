import { useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch, useSelector } from 'react-redux';
import { chunk, keyBy } from 'lodash';

import { useConnection } from '../../hooks';
import { createIx, mergeIxsIntoTxn } from '../Layout/helpers';
import { commonActions } from '../../state/common/actions';
import { coreActions } from '../../state/core/actions';
import { txsLoadingModalActions } from '../../state/txsLoadingModal/actions';
import { selectCartSiderVisible } from '../../state/common/selectors';
import {
  selectAllInvalidCartOrders,
  selectCartItems,
  selectCartPairs,
  selectCartPendingOrders,
  selectIsCartEmpty,
} from '../../state/core/selectors';
import { selectTokenExchange } from '../../state/tokenExchange/selectors';
import { TxsLoadingModalTextStatus } from '../../state/txsLoadingModal/reducers';
import { createIxCardFuncs, IX_TYPE } from '../TransactionsLoadingModal';
import { notify } from '../../utils';
import { NotifyType } from '../../utils/solanaUtils';
import { signAndSendTransactionsInSeries } from '../../utils/transactions';
import { CartOrder } from '../../state/core/types';
import { TokenItem } from '../../constants/tokens';
import { useTokenInfo, useTokenRate } from '../../requests';
import { calcAmount } from '../Jupiter/utils';
import JSBI from 'jsbi';

export interface CrossMintConfig {
  type: string;
  mintHash: string;
  pairPublicKey: string;
}

type UseCartSider = () => {
  cartItems: {
    buy: CartOrder[];
    sell: CartOrder[];
  };
  cartOpened: boolean;
  isCartEmpty: boolean;
  invalidItems: CartOrder[];
  itemsAmount: number;
  totalBuy: number;
  totalSell: number;
  isOneBuyNft: boolean;
  crossmintConfig: CrossMintConfig;
};

type UseSwap = (params: {
  onAfterTxn: () => void;
  onFail?: () => void;
  ixsPerTxn?: number;
  onSuccessTxn?: () => void;
}) => {
  swap: () => Promise<void>;
};

export const useCartSider: UseCartSider = () => {
  const cartItems = useSelector(selectCartItems);
  const cartOpened = useSelector(selectCartSiderVisible);
  const invalidItems = useSelector(selectAllInvalidCartOrders);
  const isCartEmpty = useSelector(selectIsCartEmpty);

  const itemsAmount = cartItems.buy.length + cartItems.sell.length;
  const totalBuy = cartItems.buy.reduce((acc, item) => acc + item.price, 0);
  const totalSell = cartItems.sell.reduce((acc, item) => acc + item.price, 0);

  const isOneBuyNft = cartItems.buy.length === 1;
  const crossmintConfig = {
    type: cartItems?.buy[0]?.name,
    mintHash: cartItems?.buy[0]?.mint,
    pairPublicKey: cartItems?.buy[0]?.targetPairPukey,
  };

  return {
    cartItems,
    cartOpened,
    isCartEmpty,
    invalidItems,
    itemsAmount,
    totalBuy,
    totalSell,
    isOneBuyNft,
    crossmintConfig,
  };
};

export const useSwap: UseSwap = ({
  onAfterTxn,
  onSuccessTxn,
  onFail,
  ixsPerTxn = 1,
}) => {
  const connection = useConnection();
  const wallet = useWallet();
  const dispatch = useDispatch();

  const orders = useSelector(selectCartPendingOrders);
  const pairs = useSelector(selectCartPairs);

  const swap = async () => {
    const ordersArray = Object.values(orders).flat();
    const ordersByMint = keyBy(ordersArray, 'mint');

    const ixsData = await Promise.all(
      ordersArray.map((order) =>
        createIx({
          connection,
          walletPubkey: wallet.publicKey,
          pair: pairs[order.targetPairPukey],
          order,
        }),
      ),
    );
    const ixsDataChunks = chunk(ixsData, ixsPerTxn);

    const txnsData = ixsDataChunks.map((ixsAndSigners) =>
      mergeIxsIntoTxn(ixsAndSigners),
    );

    dispatch(commonActions.setCartSider({ isVisible: false }));

    const allTxnsSuccess = await signAndSendTransactionsInSeries({
      txnData: txnsData.map((txnData, idx, txnDataArr) => ({
        ...txnData,
        onBeforeApprove: () => {
          dispatch(
            txsLoadingModalActions.setState({
              visible: true,
              cards: txnData.nftMints.map((mint) =>
                createIxCardFuncs[IX_TYPE.COMPLETE_ORDER](ordersByMint?.[mint]),
              ),
              amountOfTxs: txnDataArr.length,
              currentTxNumber: idx + 1,
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
          txnData.nftMints.map((nftMint) => {
            dispatch(coreActions.addFinishedOrderMint(nftMint));
          });
          onSuccessTxn?.();
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
      })),
      connection,
      wallet,
    });

    if (!allTxnsSuccess) {
      onFail?.();
    }

    onAfterTxn?.();
  };

  return {
    swap,
  };
};

type UseExchangeData = (params: { rawSolAmount: number }) => {
  amount: JSBI;
  tokenAmount: string;
  exchangeLoading: boolean;
  exchangeFetching: boolean;
  tokenExchange: TokenItem;
  rate: number;
};

export const useExchangeData: UseExchangeData = ({ rawSolAmount }) => {
  const tokenExchange = useSelector(selectTokenExchange);

  const { tokensData, tokensLoading, tokensFetching } = useTokenInfo({
    tokenValue: tokenExchange?.value,
  });
  const { tokenRate, rateLoading, rateFetching } = useTokenRate({
    tokenValue: tokenExchange?.value,
  });

  const inputTokenInfo = useMemo(() => {
    return tokensData?.find((item) => item.address === tokenExchange?.value);
  }, [tokensData, tokenExchange?.value]);

  const { amount, tokenAmount, rate } = useMemo(
    () => calcAmount(rawSolAmount, inputTokenInfo?.decimals, tokenRate?.price),
    [rawSolAmount, inputTokenInfo, tokenRate],
  );

  return {
    amount,
    tokenAmount,
    tokenExchange,
    rate,
    exchangeLoading: tokensLoading || rateLoading,
    exchangeFetching: tokensFetching || rateFetching,
  };
};
