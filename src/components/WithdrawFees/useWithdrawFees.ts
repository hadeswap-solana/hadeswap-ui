import { useDispatch } from 'react-redux';
import { useWallet } from '@solana/wallet-adapter-react';

import { createWithdrawLiquidityFeesTxns } from '../../utils/transactions/createWithdrawLiquidityFeesTxns';
import { createIxCardFuncs, IX_TYPE } from '../TransactionsLoadingModal';
import { txsLoadingModalActions } from '../../state/txsLoadingModal/actions';
import { TxsLoadingModalTextStatus } from '../../state/txsLoadingModal/reducers';
import { notify } from '../../utils';
import { formatRawSol, NotifyType } from '../../utils/solanaUtils';
import { signAndSendAllTransactions } from '../../utils/transactions';
import { useConnection } from '../../hooks';
import { Pair } from '../../state/core/types';
import { useFetchPair } from '../../requests';

type UseWithdrawFees = (props: { pool: Pair }) => {
  onWithdrawClick: () => Promise<void>;
  accumulatedFees: string;
  isWithdrawDisabled: boolean;
};

export const useWithdrawFees: UseWithdrawFees = ({ pool }) => {
  const dispatch = useDispatch();
  const connection = useConnection();
  const wallet = useWallet();
  const { refetch } = useFetchPair();

  const accumulatedFees = formatRawSol(pool?.totalAccumulatedFees);
  const isWithdrawDisabled = !parseFloat(accumulatedFees);

  const onWithdrawClick = async () => {
    const transactions = [];

    const txns = await createWithdrawLiquidityFeesTxns({
      connection,
      wallet,
      pairPubkey: pool.pairPubkey,
      authorityAdapter: pool.authorityAdapterPubkey,
      liquidityProvisionOrders: pool.liquidityProvisionOrders,
    });

    transactions.push(...txns);

    const cards = transactions.map(() =>
      createIxCardFuncs[IX_TYPE.WITHDRAW_FEES](),
    );

    await signAndSendAllTransactions({
      connection,
      wallet,
      txnsAndSigners: transactions,
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
      onError: () => {
        notify({
          message: 'Some transactions were failed for some reason',
          type: NotifyType.ERROR,
        });
      },
      onSuccess: () => {
        refetch();
      },
    });

    dispatch(txsLoadingModalActions.setVisible(false));
  };

  return {
    onWithdrawClick,
    accumulatedFees,
    isWithdrawDisabled,
  };
};
