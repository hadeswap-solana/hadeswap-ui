import { useDispatch } from 'react-redux';
import { useWallet } from '@solana/wallet-adapter-react';
import { useFetchPair } from '../../../requests';
import { BasePair } from '../../../state/core/types';
import { txsLoadingModalActions } from '../../../state/txsLoadingModal/actions';
import { TxsLoadingModalTextStatus } from '../../../state/txsLoadingModal/reducers';
import { notify } from '../../../utils';
import { NotifyType } from '../../../utils/solanaUtils';
import {
  createIxCardFuncs,
  IX_TYPE,
} from '../../../components/TransactionsLoadingModal';
import { signAndSendAllTransactionsInSeries } from '../../../utils/transactions';
import { useConnection } from '../../../hooks';
import { createWithdrawLiquidityAllFeesTxns } from '../../../utils/transactions/createWithdrawLiquidityAllFeesTxns';

type UseWithdrawAllFees = (props: { poolsWithFees: BasePair[] }) => {
  onWithdrawClick: () => Promise<void>;
};

export const useWithdrawAllFees: UseWithdrawAllFees = ({ poolsWithFees }) => {
  const dispatch = useDispatch();
  const connection = useConnection();
  const wallet = useWallet();
  const { refetch } = useFetchPair();

  const onWithdrawClick = async () => {
    const transactions = [];

    const txns = await createWithdrawLiquidityAllFeesTxns({
      connection,
      wallet,
      poolsWithFees,
    });

    transactions.push(...txns);

    const cards = transactions.map(() =>
      createIxCardFuncs[IX_TYPE.WITHDRAW_FEES](),
    );

    const txnsData = transactions.map((txnsAndSigners) => ({
      txnsAndSigners,
      onBeforeApprove: () => {
        dispatch(
          txsLoadingModalActions.setState({
            visible: true,
            cards,
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
    }));

    const isSuccess = await signAndSendAllTransactionsInSeries({
      txnsData,
      wallet,
      connection,
    });

    dispatch(txsLoadingModalActions.setVisible(false));

    if (isSuccess) refetch();
  };
  return {
    onWithdrawClick,
  };
};
