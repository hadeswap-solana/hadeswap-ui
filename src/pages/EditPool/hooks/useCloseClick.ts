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
} from '../../../utils/transactions';
import { TxnData } from '../../../types/transactions';

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
    const transaction: TxnData = await createClosePairTxn({
      connection,
      wallet,
      pairPubkey: pool.pairPubkey,
      authorityAdapter: pool.authorityAdapterPubkey,
    });

    const txnsDataArray: TxnData[] = [
      {
        ...transaction,
        loadingModalCard: [createIxCardFuncs[IX_TYPE.CLOSE_POOL]()],
      },
    ];

    const txnsData: TxnData[] = getTxnsDataOneByOne(txnsDataArray, dispatch);
    const closeModal = () => dispatch(txsLoadingModalActions.setVisible(false));
    try {
      await signAndSendTransactionsOneByOne({
        txnsData,
        connection,
        wallet,
        closeModal,
      });
      history.push(`/my-pools`);
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
    onCloseClick,
    isClosePoolDisabled,
  };
};
