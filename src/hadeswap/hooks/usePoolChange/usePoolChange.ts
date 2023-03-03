import { signAndSendAllTransactionsInSeries } from '../../../utils/transactions';
import { useDispatch } from 'react-redux';
import { useWallet } from '@solana/wallet-adapter-react';
import { useHistory } from 'react-router-dom';

import {
  buildChangePoolTxnsData,
  buildWithdrawAllLiquidityFromPoolTxnsData,
  checkIsPoolChanged,
} from './helpers';
import { useConnection } from '../../../hooks';
import { Nft, Pair } from '../../../state/core/types';
import { txsLoadingModalActions } from '../../../state/txsLoadingModal/actions';
import { TxsLoadingModalTextStatus } from '../../../state/txsLoadingModal/reducers';
import { notify } from '../../../utils';
import { NotifyType } from '../../../utils/solanaUtils';

export type UsePoolChange = (props: {
  pool: Pair;
  selectedNfts: Nft[];
  buyOrdersAmount?: number;
  rawFee: number;
  rawSpotPrice: number;
  currentRawSpotPrice: number;
  rawDelta: number;
}) => {
  change: () => Promise<void>;
  withdrawAllLiquidity: () => Promise<void>;
  isChanged: boolean;
  isWithdrawAllAvailable: boolean;
};

export const usePoolChange: UsePoolChange = ({
  pool,
  selectedNfts,
  buyOrdersAmount, //? For TokenForNft and LiquidityProvision pool only!
  rawFee,
  rawDelta,
  rawSpotPrice,
  currentRawSpotPrice,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const wallet = useWallet();
  const connection = useConnection();

  const isChanged = checkIsPoolChanged({
    pool,
    rawSpotPrice,
    rawFee,
    rawDelta,
    selectedNfts,
    buyOrdersAmount,
  });

  const change = async () => {
    const txnsDataArray = await buildChangePoolTxnsData({
      pool,
      selectedNfts,
      buyOrdersAmount,
      rawFee,
      rawDelta,
      rawSpotPrice,
      currentRawSpotPrice,
      wallet,
      connection,
    });
    const txnsData = txnsDataArray.map(
      (txnsData, txnsDataIdx, txnsDataArray) => ({
        txnsAndSigners: txnsData.map(({ transaction, signers }) => ({
          transaction,
          signers,
        })),
        onBeforeApprove: () => {
          dispatch(
            txsLoadingModalActions.setState({
              visible: true,
              cards: txnsData.map(({ loadingModalCard }) => loadingModalCard),
              amountOfTxs: txnsDataArray?.flat()?.length || 0,
              currentTxNumber:
                txnsDataArray?.slice(0, txnsDataIdx + 1)?.flat()?.length || 0,
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
      }),
    );

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

  const withdrawAllLiquidity = async () => {
    const txnsDataArray = await buildWithdrawAllLiquidityFromPoolTxnsData({
      pool,
      rawDelta,
      rawSpotPrice,
      wallet,
      connection,
    });

    const txnsData = txnsDataArray.map(
      (txnsData, txnsDataIdx, txnsDataArray) => ({
        txnsAndSigners: txnsData.map(({ transaction, signers }) => ({
          transaction,
          signers,
        })),
        onBeforeApprove: () => {
          dispatch(
            txsLoadingModalActions.setState({
              visible: true,
              cards: txnsData.map(({ loadingModalCard }) => loadingModalCard),
              amountOfTxs: txnsDataArray?.flat()?.length || 0,
              currentTxNumber:
                txnsDataArray?.slice(0, txnsDataIdx + 1)?.flat()?.length || 0,
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
      }),
    );

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
    isChanged,
    withdrawAllLiquidity,
    isWithdrawAllAvailable: !!(pool?.buyOrdersAmount || pool?.nftsCount),
  };
};
