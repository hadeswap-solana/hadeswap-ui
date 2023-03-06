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
import { TxnData } from './types';

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
  withdrawAllLiquidity: () => Promise<void>;
  isChanged: boolean;
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

    signAndSend({
      isSupportSignAllTxns,
      txnsDataArray,
      dispatch,
      wallet,
      connection,
    });
  };

  const withdrawAllLiquidity = async () => {
    const txnsDataArray = await buildWithdrawAllLiquidityFromPoolTxnsData({
      pool,
      rawDelta,
      rawSpotPrice,
      wallet,
      connection,
    });

    signAndSend({
      isSupportSignAllTxns,
      txnsDataArray,
      dispatch,
      wallet,
      connection,
    });
  };

  return {
    change,
    isChanged,
    withdrawAllLiquidity,
    isWithdrawAllAvailable: !!(pool?.buyOrdersAmount || pool?.nftsCount),
  };
};

const signAndSend = async ({
  isSupportSignAllTxns,
  txnsDataArray,
  dispatch,
  wallet,
  connection,
}: SignAndSend) => {
  if (!isSupportSignAllTxns) {
    const txnsData = getTxnsDataOneByOne(txnsDataArray, dispatch);
    await signAndSendTransactionsOneByOne({
      txnsData,
      wallet,
      connection,
    });
  } else {
    const txnsData = getTxnsDataSeries(txnsDataArray, dispatch);
    await signAndSendAllTransactionsInSeries({
      txnsData,
      wallet,
      connection,
    });
  }

  dispatch(txsLoadingModalActions.setVisible(false));
};
