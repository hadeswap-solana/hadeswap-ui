import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { createClosePairTxn } from '../../../utils/transactions/createClosePairTxn';
import {
  createIxCardFuncs,
  IX_TYPE,
} from '../../../components/TransactionsLoadingModal';
import { txsLoadingModalActions } from '../../../state/txsLoadingModal/actions';
import { notify } from '../../../utils';
import { NotifyType } from '../../../utils/solanaUtils';
import { useConnection } from '../../../hooks';
import { Pair } from '../../../state/core/types';
import {
  signAndSendTransactionsOneByOne,
  getTxnsDataOneByOne,
  TxnsDataOneByOne,
} from '../../../utils/transactions';
import { TxnData } from './usePoolChange/types';

export const useCloseClick = ({
  pool,
}: {
  pool: Pair;
}): {
  onCloseClick: () => Promise<void>;
  isClosePoolDisabled: boolean;
} => {
  const dispatch = useDispatch();
  const history = useHistory();
  const connection = useConnection();
  const wallet = useWallet();

  const isClosePoolDisabled = !(
    pool?.nftsCount === 0 && pool?.buyOrdersAmount === 0
  );

  const onCloseClick = async () => {
    const transactions: TxnData[] = [];
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

    const txnsData: TxnsDataOneByOne[] = getTxnsDataOneByOne(
      transactions,
      dispatch,
    );

    try {
      await signAndSendTransactionsOneByOne({
        txnsData,
        connection,
        wallet,
      });
      history.push(`/my-pools`);
    } catch {
      notify({
        message: 'oops... something went wrong!',
        type: NotifyType.ERROR,
      });
    } finally {
      dispatch(txsLoadingModalActions.setVisible(false));
    }
  };

  return {
    onCloseClick,
    isClosePoolDisabled,
  };
};
