import { useDispatch } from 'react-redux';
import { useWallet } from '@solana/wallet-adapter-react';

import { createWithdrawLiquidityFeesTxns } from '../../utils/transactions/createWithdrawLiquidityFeesTxns';
import { createIxCardFuncs, IX_TYPE } from '../TransactionsLoadingModal';
import { txsLoadingModalActions } from '../../state/txsLoadingModal/actions';
import { notify } from '../../utils';
import { formatRawSol, NotifyType } from '../../utils/solanaUtils';
import { useConnection } from '../../hooks';
import { Pair } from '../../state/core/types';
import { useFetchPair } from '../../requests';
import {
  getTxnsDataSeries,
  signAndSendAllTransactionsInSeries,
} from '../../utils/transactions';

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
    const transactions = await createWithdrawLiquidityFeesTxns({
      connection,
      wallet,
      pairPubkey: pool.pairPubkey,
      authorityAdapter: pool.authorityAdapterPubkey,
      liquidityProvisionOrders: pool.liquidityProvisionOrders,
    });

    const txnsDataArray = transactions.map((txn) => ({
      ...txn,
      loadingModalCard: createIxCardFuncs[IX_TYPE.WITHDRAW_FEES](),
      onSuccess: () => refetch(),
    }));

    const txnsData = getTxnsDataSeries([txnsDataArray], dispatch);
    const closeModal = () => dispatch(txsLoadingModalActions.setVisible(false));
    try {
      await signAndSendAllTransactionsInSeries({
        txnsData,
        connection,
        wallet,
        closeModal,
      });
    } catch {
      notify({
        message: 'oops... something went wrong!',
        type: NotifyType.ERROR,
      });
    } finally {
      closeModal();
    }
  };

  return {
    onWithdrawClick,
    accumulatedFees,
    isWithdrawDisabled,
  };
};
