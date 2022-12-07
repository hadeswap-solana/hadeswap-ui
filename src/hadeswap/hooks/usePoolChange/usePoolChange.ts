import { useDispatch } from 'react-redux';
import { useWallet } from '@solana/wallet-adapter-react';
import { useHistory } from 'react-router-dom';
import { differenceBy } from 'lodash';
import { PairType } from 'hadeswap-sdk/lib/hadeswap-core/types';

import {
  checkIsPricingChanged,
  createDepositLiquidityToPairTxnsData,
  createDepositNftsToPairTxnsData,
  createDepositSOLToPairTxnsData,
  createModifyPairTxnData,
  createWithdrawLiquidityFromPairTxnsData,
  createWithdrawNftsFromPairTxnsData,
  createWithdrawSOLFromPairTxnsData,
} from './helpers';
import { useConnection } from '../../../hooks';
import { Nft, Pair } from '../../../state/core/types';
import { TxnData } from './types';

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

  const isTokenForNFTPool = pool.type === PairType.TokenForNFT;
  const isNftForTokenPool = pool.type === PairType.NftForToken;
  const isLiquidityProvisionPool = pool.type === PairType.LiquidityProvision;

  const isPricingChanged = checkIsPricingChanged({
    pool,
    rawSpotPrice,
    rawFee,
    rawDelta,
  });

  const nftsToRemove = differenceBy(pool?.sellOrders, selectedNfts, 'mint');
  const nftsToDeposit = selectedNfts.filter((nft) => !nft.nftPairBox);

  const change = async () => {
    const txnsData: TxnData[][] = [];

    //! Remove liquidity transactions:
    //? Buy
    if (isTokenForNFTPool && pool.buyOrdersAmount < buyOrdersAmount) {
      const withdrawSOLTxnsData = await createWithdrawSOLFromPairTxnsData({
        pool,
        rawSpotPrice,
        rawDelta,
        withdrawOrdersAmount: 10, //TODO Calc difference
        connection,
        wallet,
      });
      txnsData.push(withdrawSOLTxnsData);
    }
    //? Sell
    if (isNftForTokenPool && !!nftsToRemove.length) {
      const withdrawNftsTxnsData = await createWithdrawNftsFromPairTxnsData({
        pool,
        withdrawableNfts: nftsToRemove,
        connection,
        wallet,
      });
      txnsData.push(withdrawNftsTxnsData);
    }
    //? Liquidty
    if (isLiquidityProvisionPool && !!nftsToRemove.length) {
      const [balancedTxnsData, unbalancedTxnsData] =
        await createWithdrawLiquidityFromPairTxnsData({
          pool,
          withdrawableNfts: nftsToRemove,
          rawSpotPrice,
          rawDelta,
          connection,
          wallet,
        });

      txnsData.push(balancedTxnsData);
      unbalancedTxnsData.length && txnsData.push(unbalancedTxnsData);
    }

    //! Pair modification transaction logic
    if (isPricingChanged) {
      const modifyTxnData = await createModifyPairTxnData({
        pool,
        rawSpotPrice,
        rawFee,
        rawDelta,
        connection,
        wallet,
      });
      txnsData.push([modifyTxnData]);
    }

    //! Add liquidity transactions
    //? Buy
    if (isTokenForNFTPool && pool.buyOrdersAmount > buyOrdersAmount) {
      const depositSOLTxnsData = await createDepositSOLToPairTxnsData({
        pool,
        rawSpotPrice,
        rawDelta,
        ordersAmount: 10, //TODO Calc difference
        connection,
        wallet,
      });
      txnsData.push(depositSOLTxnsData);
    }

    //? Sell -- easy
    if (isNftForTokenPool && !!nftsToDeposit.length) {
      const depositNftsTxnsData = await createDepositNftsToPairTxnsData({
        pool,
        nftsToDeposit,
        connection,
        wallet,
      });
      txnsData.push(depositNftsTxnsData);
    }

    //? Liquidity -- easy
    if (isLiquidityProvisionPool && !!nftsToDeposit.length) {
      const depositLiquidityTxnsData =
        await createDepositLiquidityToPairTxnsData({
          pool,
          nftsToDeposit,
          rawSpotPrice,
          rawDelta,
          connection,
          wallet,
        });
      txnsData.push(depositLiquidityTxnsData);
    }
  };
};
