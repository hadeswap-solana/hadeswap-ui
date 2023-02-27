import { useDispatch } from 'react-redux';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  createIxCardFuncs,
  IX_TYPE,
} from '../../../components/TransactionsLoadingModal';
import { txsLoadingModalActions } from '../../../state/txsLoadingModal/actions';
import { TxsLoadingModalTextStatus } from '../../../state/txsLoadingModal/reducers';
import { useConnection } from '../../../hooks';
import { createWithdrawLiquidityAllFeesTxns } from '../../../utils/transactions/createWithdrawLiquidityAllFeesTxns';
import { notify } from '../../../utils';
import { NotifyType } from '../../../utils/solanaUtils';
import { Pair } from '../../../state/core/types';
import { signAndSendAllTransactions } from '../../../utils/transactions';

type UseWithdrawAllFees = (props: { pairs: Pair[] }) => {
  onWithdrawClick: () => Promise<void>;
  isWithdrawAllAvailable: boolean;
};

export const useWithdrawAllFees: UseWithdrawAllFees = ({ pairs }) => {
  const dispatch = useDispatch();
  const connection = useConnection();
  const wallet = useWallet();

  const poolsWithFees = pairs.filter((pool) => pool.totalAccumulatedFees > 0);
  const isWithdrawAllAvailable = Boolean(poolsWithFees.length);

  const onWithdrawClick = async () => {
    const txns = await createWithdrawLiquidityAllFeesTxns({
      connection,
      wallet,
      poolsWithFees,
    });

    const cards = txns.map(() => createIxCardFuncs[IX_TYPE.WITHDRAW_FEES]());

    const txnsData = {
      txnsAndSigners: txns,
      onBeforeApprove: () => {
        dispatch(
          txsLoadingModalActions.setState({
            visible: true,
            cards,
            amountOfTxs: txns.length,
            currentTxNumber: txns.length,
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
        notify({
          message: 'transaction successful!',
          type: NotifyType.SUCCESS,
        });
      },
      onError: () =>
        notify({
          message: 'oops... something went wrong!',
          type: NotifyType.ERROR,
        }),
    };

    await signAndSendAllTransactions({
      ...txnsData,
      wallet,
      connection,
    });

    dispatch(txsLoadingModalActions.setVisible(false));
  };
  return {
    onWithdrawClick,
    isWithdrawAllAvailable,
  };
};
