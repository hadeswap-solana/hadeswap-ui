import { createClosePairTxn } from '../../../utils/transactions/createClosePairTxn';
import {
  createIxCardFuncs,
  IX_TYPE,
} from '../../../components/TransactionsLoadingModal';
import { signAndSendTransactionsInSeries } from '../../../components/Layout/helpers';
import { txsLoadingModalActions } from '../../../state/txsLoadingModal/actions';
import { TxsLoadingModalTextStatus } from '../../../state/txsLoadingModal/reducers';
import { notify } from '../../../utils';
import { NotifyType } from '../../../utils/solanaUtils';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useConnection } from '../../../hooks';
import { useWallet } from '@solana/wallet-adapter-react';
import { Pair } from '../../../state/core/types';

export const useCloseClick = ({
  pool,
}: {
  pool: Pair;
}): (() => Promise<void>) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const connection = useConnection();
  const wallet = useWallet();

  return async () => {
    const transactions = [];
    const cards = [];

    transactions.push(
      await createClosePairTxn({
        connection,
        wallet,
        pairPubkey: pool.pairPubkey,
        authorityAdapter: pool.authorityAdapterPubkey,
      }),
    );

    cards.push([createIxCardFuncs[IX_TYPE.CLOSE_POOL]()]);

    const isSuccess = await signAndSendTransactionsInSeries({
      connection,
      wallet,
      txnData: transactions.map((txn, index) => ({
        signers: txn.signers,
        transaction: txn.transaction,
        onBeforeApprove: () => {
          dispatch(
            txsLoadingModalActions.setState({
              visible: true,
              cards: cards[index],
              amountOfTxs: transactions.length,
              currentTxNumber: 1 + index,
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
            message: 'Transaction just failed for some reason',
            type: NotifyType.ERROR,
          });
        },
      })),
    });

    dispatch(txsLoadingModalActions.setVisible(false));

    if (isSuccess) {
      history.push(`/my-pools`);
    }
  };
};
