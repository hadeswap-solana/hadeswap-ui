import { coreActions } from './../../state/core/actions/index';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCartPendingOrders,
  selectCartPairs,
} from '../../state/core/selectors';
import { chunk, keyBy } from 'lodash';
import { useConnection } from '../../hooks';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  createIx,
  mergeIxsIntoTxn,
  signAndSendTransactionsInSeries,
} from './helpers';
import { notify } from '../../utils';
import { NotifyType } from '../../utils/solanaUtils';
import { commonActions } from '../../state/common/actions';
import { swapTxsLoadingModalActions } from '../../state/swapTxsLoadingModal/actions';
import { SwapTxsLoadingModalTextStatus } from '../../state/swapTxsLoadingModal/reducers';

type UseSwap = () => {
  swap: () => Promise<void>;
};

export const useSwap: UseSwap = () => {
  const IX_PER_TXN = 3;

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
            swapTxsLoadingModalActions.setState({
              visible: true,
              ordersInTx: txnData.nftMints.map((mint) => ordersByMint?.[mint]),
              amountOfTxs: txnDataArr.length,
              currentTxNumber: idx + 1,
              textStatus: SwapTxsLoadingModalTextStatus.APPROVE,
            }),
          );
        },
        onAfterSend: () => {
          dispatch(
            swapTxsLoadingModalActions.setTextStatus(
              SwapTxsLoadingModalTextStatus.WAITING,
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

    dispatch(swapTxsLoadingModalActions.setVisible(false));
  };

  return {
    swap,
  };
};
