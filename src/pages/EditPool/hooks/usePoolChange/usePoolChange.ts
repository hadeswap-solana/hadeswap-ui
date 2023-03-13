import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { web3 } from 'hadeswap-sdk';
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import {
  buildChangePoolTxnsData,
  buildWithdrawAllLiquidityFromPoolTxnsData,
  checkIsPoolChanged,
} from './helpers';
import { useConnection } from '../../../../hooks';
import { Nft, Pair } from '../../../../state/core/types';
import { txsLoadingModalActions } from '../../../../state/txsLoadingModal/actions';
import {
  signAndSendAllTransactionsInSeries,
  getTxnsDataSeries,
  signAndSendTransactionsOneByOne,
  getTxnsDataOneByOne,
} from '../../../../utils/transactions';
import { TxnData } from '../../../../types/transactions';
import { useHistory } from 'react-router-dom';
import { notify } from '../../../../utils';
import { NotifyType } from '../../../../utils/solanaUtils';

export type UsePoolChange = (props: {
  pool: Pair;
  selectedNfts: Nft[];
  buyOrdersAmount?: number;
  rawFee: number;
  rawSpotPrice: number;
  currentRawSpotPrice: number;
  rawDelta: number;
  isSupportSignAllTxns?: boolean;
}) => {
  change: () => Promise<void>;
  isChanged: boolean;
};

export type UseWithdrawLiquidity = (props: {
  pool: Pair;
  rawDelta: number;
  rawSpotPrice: number;
  isSupportSignAllTxns: boolean;
}) => {
  withdrawAllLiquidity: () => Promise<void>;
  isWithdrawAllAvailable: boolean;
};

interface SignAndSend {
  isSupportSignAllTxns: boolean;
  txnsDataArray: TxnData[][];
  dispatch: Dispatch;
  wallet: WalletContextState;
  connection: web3.Connection;
}

export const usePoolChange: UsePoolChange = ({
  pool,
  selectedNfts,
  buyOrdersAmount, //? For TokenForNft and LiquidityProvision pool only!
  rawFee,
  rawDelta,
  rawSpotPrice,
  currentRawSpotPrice,
  isSupportSignAllTxns,
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

    const success = await signAndSend({
      isSupportSignAllTxns,
      txnsDataArray,
      dispatch,
      wallet,
      connection,
    });

    if (success) {
      history.push(`/pools/${pool?.pairPubkey}`);
    }
  };

  return {
    change,
    isChanged,
  };
};

export const useWithdrawLiquidity: UseWithdrawLiquidity = ({
  pool,
  rawDelta,
  rawSpotPrice,
  isSupportSignAllTxns,
}) => {
  const dispatch = useDispatch();
  const wallet = useWallet();
  const connection = useConnection();

  const withdrawAllLiquidity = async () => {
    const txnsDataArray = await buildWithdrawAllLiquidityFromPoolTxnsData({
      pool,
      rawDelta,
      rawSpotPrice,
      wallet,
      connection,
    });

    await signAndSend({
      isSupportSignAllTxns,
      txnsDataArray,
      dispatch,
      wallet,
      connection,
    });
  };

  return {
    withdrawAllLiquidity,
    isWithdrawAllAvailable: !!(pool?.buyOrdersAmount || pool?.nftsCount),
  };
};

const signAndSend = async ({
  isSupportSignAllTxns = true,
  txnsDataArray,
  dispatch,
  wallet,
  connection,
}: SignAndSend): Promise<boolean> => {
  const closeModal = () => dispatch(txsLoadingModalActions.setVisible(false));
  try {
    if (!isSupportSignAllTxns) {
      const txnsData = getTxnsDataOneByOne(txnsDataArray.flat(), dispatch);
      await signAndSendTransactionsOneByOne({
        txnsData,
        wallet,
        connection,
        closeModal,
      });
    } else {
      const txnsData = getTxnsDataSeries(txnsDataArray, dispatch);
      await signAndSendAllTransactionsInSeries({
        txnsData,
        wallet,
        connection,
        closeModal,
      });
    }
    return true;
  } catch {
    notify({
      message: 'oops... something went wrong!',
      type: NotifyType.ERROR,
    });
    return false;
  } finally {
    closeModal();
  }
};
