import { signAndSendAllTransactionsInSeries } from './../../../utils/transactions/helpers/signAndSendAllTransactionsInSeries';
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
import { captureSentryError } from '../../../utils/sentry';
import { signAndSendTransaction } from '../../../utils/transactions';

export type UsePoolChange = (props: {
  pool: Pair;
  selectedNfts: Nft[];
  buyOrdersAmount?: number;
  rawFee: number;
  rawSpotPrice: number;
  rawDelta: number;
  isV0Transaction?: boolean;
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
  isV0Transaction,
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

    if (!isV0Transaction) {
      for (let i = 0; i < txnsDataArray.flat().length; ++i) {
        const { transaction, signers } = txnsDataArray.flat()[i];

        dispatch(
          txsLoadingModalActions.setState({
            visible: true,
            cards: txnsDataArray
              .flat()
              .map(({ loadingModalCard }) => loadingModalCard),
            amountOfTxs: txnsDataArray.flat().length || 0,
            currentTxNumber: i + 1 || 0,
            textStatus: TxsLoadingModalTextStatus.APPROVE,
          }),
        );

        try {
          await signAndSendTransaction({
            transaction,
            signers,
            wallet,
            connection,
            commitment: 'confirmed',
          });
        } catch (error) {
          captureSentryError({
            error,
            wallet,
          });
        }
      }
    } else {
      const isSuccess = await signAndSendAllTransactionsInSeries({
        txnsData,
        wallet,
        connection,
      });

      if (isSuccess) {
        history.push(`/pools/${pool?.pairPubkey}`);
      }
    }

    dispatch(txsLoadingModalActions.setVisible(false));
  };

  return {
    change,
    isChanged,
    withdrawAllLiquidity,
    isWithdrawAllAvailable: !!(pool?.buyOrdersAmount || pool?.nftsCount),
  };
};
