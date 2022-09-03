import { coreActions } from './../../state/core/actions/index';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCartPendingOrders,
  selectCartPairs,
} from '../../state/core/selectors';
import { chunk } from 'lodash';
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

    const allTxnsSuccess = await signAndSendTransactionsInSeries({
      txnData: txnsData.map((txnData) => ({
        ...txnData,
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

    allTxnsSuccess &&
      dispatch(commonActions.setCartSider({ isVisible: false }));
  };

  return {
    swap,
  };
};
