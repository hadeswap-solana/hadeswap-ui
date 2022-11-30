import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch, useSelector } from 'react-redux';
import { chunk, keyBy } from 'lodash';

import { selectExchangeModalVisible } from '../../state/common/selectors';
import { TxsLoadingModalTextStatus } from '../../state/txsLoadingModal/reducers';
import { txsLoadingModalActions } from './../../state/txsLoadingModal/actions';
import { createIxCardFuncs } from './../TransactionsLoadingModal/helpers';
import { signAndSendTransactionsInSeries } from './../Layout/helpers';
import { createIx, mergeIxsIntoTxn } from '../Layout/helpers';
import { IX_TYPE } from './../TransactionsLoadingModal/types';
import { commonActions } from './../../state/common/actions';
import { coreActions } from '../../state/core/actions';
import { NotifyType } from '../../utils/solanaUtils';
import { useConnection } from '../../hooks';
import { notify } from '../../utils';
import {
  selectCartPairs,
  selectCartPendingOrders,
} from './../../state/core/selectors/cartSelectors';

type UseExchange = (onAfterTxn: () => void) => {
  swap: () => Promise<void>;
};

export const useExchange: UseExchange = (onAfterTxn) => {
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

    await signAndSendTransactionsInSeries({
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

    onAfterTxn();
  };

  return {
    swap,
  };
};

type UseExchangeModal = () => {
  visible: boolean;
  open: () => void;
  close: () => void;
};

export const useExchangeModal: UseExchangeModal = () => {
  const dispatch = useDispatch();
  const visible = useSelector(selectExchangeModalVisible);

  const open = () => {
    dispatch(commonActions.setExchangeModal({ isVisible: true }));
  };

  const close = () => {
    dispatch(commonActions.setExchangeModal({ isVisible: false }));
  };

  return {
    visible,
    open,
    close,
  };
};
