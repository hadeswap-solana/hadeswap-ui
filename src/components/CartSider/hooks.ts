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
  selectExchangeToken,
} from '../../state/core/selectors';
import { TxsLoadingModalTextStatus } from '../../state/txsLoadingModal/reducers';
import { createIxCardFuncs, IX_TYPE } from '../TransactionsLoadingModal';
import { notify } from '../../utils';
import { NotifyType } from '../../utils/solanaUtils';
import { signAndSendTransactionsInSeries } from '../../utils/transactions';
import { CartOrder } from '../../state/core/types';
import { Tokens } from '../../types';

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
  exchangeToken: Tokens;
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
  const exchangeToken = useSelector(selectExchangeToken);

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
    exchangeToken,
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
