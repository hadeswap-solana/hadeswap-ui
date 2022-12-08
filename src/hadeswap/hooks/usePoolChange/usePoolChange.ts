import { signAndSendAllTransactionsInSeries } from './../../../utils/transactions/helpers/signAndSendAllTransactionsInSeries';
import { useDispatch } from 'react-redux';
import { useWallet } from '@solana/wallet-adapter-react';
import { useHistory } from 'react-router-dom';

import { buildChangePoolTxnsData } from './helpers';
import { useConnection } from '../../../hooks';
import { Nft, Pair } from '../../../state/core/types';
import { txsLoadingModalActions } from '../../../state/txsLoadingModal/actions';
import { TxsLoadingModalTextStatus } from '../../../state/txsLoadingModal/reducers';
import { notify } from '../../../utils';
import { NotifyType } from '../../../utils/solanaUtils';

export type UsePoolChange = (props: {
  pool: Pair;
  selectedNfts: Nft[];
  buyOrdersAmount: number;
  rawFee: number;
  rawSpotPrice: number;
  rawDelta: number;
}) => {
  change: () => Promise<void>;
  isChanged: boolean;
};

export const usePoolChange: UsePoolChange = ({
  pool,
  selectedNfts,
  buyOrdersAmount,
  rawFee,
  rawDelta,
  rawSpotPrice,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const wallet = useWallet();
  const connection = useConnection();

  const change = async () => {
    const txnsDataArray = await buildChangePoolTxnsData({
      pool,
      selectedNfts,
      buyOrdersAmount,
      rawFee,
      rawDelta,
      rawSpotPrice,
      wallet,
      connection,
    });

    const txnsData = txnsDataArray.map((txnsData) => ({
      txnsAndSigners: txnsData.map(({ transaction, signers }) => ({
        transaction,
        signers,
      })),
      onBeforeApprove: () => {
        dispatch(
          txsLoadingModalActions.setState({
            visible: true,
            cards: txnsData.map(({ loadingModalCard }) => loadingModalCard),
            amountOfTxs: 0, //TODO: calc txns amount
            currentTxNumber: 0, //TODO: calc txns amount
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
      onError: () =>
        notify({
          message: 'Transaction just failed for some reason',
          type: NotifyType.ERROR,
        }),
    }));

    const isSuccess = await signAndSendAllTransactionsInSeries({
      txnsData,
      wallet,
      connection,
    });

    dispatch(txsLoadingModalActions.setVisible(false));

    if (isSuccess) {
      history.push(`/pools/${pool?.pairPubkey}`);
    }
  };

  return {
    change,
    isChanged: true, //TODO finish it
  };
};
