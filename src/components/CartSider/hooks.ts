import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch, useSelector } from 'react-redux';
import { chunk, keyBy } from 'lodash';

import { useConnection } from '../../hooks';
import {
  createIx,
  mergeIxsIntoTxn,
  signAndSendTransactionsInSeries,
} from '../Layout/helpers';
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
import { TxsLoadingModalTextStatus } from '../../state/txsLoadingModal/reducers';
import { createIxCardFuncs, IX_TYPE } from '../TransactionsLoadingModal';
import { notify } from '../../utils';
import { NotifyType } from '../../utils/solanaUtils';
import { CartSiderProps } from './index';

type UseCartSider = () => CartSiderProps;

type UseSwap = () => {
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

  return {
    cartItems,
    cartOpened,
    isCartEmpty,
    invalidItems,
    itemsAmount,
    totalBuy,
    totalSell,
  };
};

export const useSwap: UseSwap = () => {
  const IX_PER_TXN = 2;

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

    const ixsDataChunks = chunk(ixsData, IX_PER_TXN);

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
        },
        onError: () => {
          notify({
            message: 'Transaction just failed for some reason',
            type: NotifyType.ERROR,
          });
        },
      })),
      connection,
      wallet,
    });

    if (!allTxnsSuccess) {
      dispatch(commonActions.setCartSider({ isVisible: true }));
    }

    dispatch(txsLoadingModalActions.setVisible(false));
  };

  return {
    swap,
  };
};
