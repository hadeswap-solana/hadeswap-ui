import { useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch, useSelector } from 'react-redux';
import { chunk, keyBy } from 'lodash';

import { useConnection } from '../../hooks';
import { createIx, mergeIxsIntoTxn } from '../Layout/helpers';
import { commonActions } from '../../state/common/actions';
import { coreActions } from '../../state/core/actions';
import { selectCartSiderVisible } from '../../state/common/selectors';
import {
  selectAllInvalidCartOrders,
  selectCartItems,
  selectCartPairs,
  selectCartPendingOrders,
  selectIsCartEmpty,
} from '../../state/core/selectors';
import { selectTokenExchange } from '../../state/tokenExchange/selectors';
import { createIxCardFuncs, IX_TYPE } from '../TransactionsLoadingModal';
import { getRoyalties, notify } from '../../utils';
import { NotifyType } from '../../utils/solanaUtils';
import {
  getTxnsDataOneByOne,
  signAndSendTransactionsOneByOne,
} from '../../utils/transactions';
import { CartOrder } from '../../state/core/types';
import { TokenItem } from '../../constants/tokens';
import { useTokenInfo, useTokenRate } from '../../requests';
import { calcAmount } from '../Jupiter/utils';
import JSBI from 'jsbi';
import { TxnData } from '../../types/transactions';
import { txsLoadingModalActions } from '../../state/txsLoadingModal/actions';
import { BN } from 'hadeswap-sdk';

export const getCartItemsPayRoyalties = (cartItems) => {
  const sellPnfts = [...cartItems.sell].filter(({ isPnft }) => !!isPnft);
  const sellNfts = [...cartItems.sell].filter(({ isPnft }) => !isPnft);

  const buyPnfts = [...cartItems.buy].filter(({ isPnft }) => !!isPnft);
  const buyNfts = [...cartItems.buy].filter(({ isPnft }) => !isPnft);

  const buyPnftsRoyaltyData = getRoyalties(
    buyPnfts.map((item) => ({
      market: item.market,
      nftPrice: new BN(item.price),
      royaltyPercent: item.royaltyPercent,
      isPnft: item.isPnft,
    })),
  );

  const buyNftsRoyaltyData = getRoyalties(
    buyNfts.map((item) => ({
      market: item.market,
      nftPrice: new BN(item.price),
      royaltyPercent: item.royaltyPercent,
      isPnft: item.isPnft,
    })),
  );

  const sellPnftsRoyaltyData = getRoyalties(
    sellPnfts.map((item) => ({
      market: item.market,
      nftPrice: new BN(item.price),
      royaltyPercent: item.royaltyPercent,
      isPnft: item.isPnft,
    })),
  );

  const sellNftsRoyaltyData = getRoyalties(
    sellNfts.map((item) => ({
      market: item.market,
      nftPrice: new BN(item.price),
      royaltyPercent: item.royaltyPercent,
      isPnft: item.isPnft,
    })),
  );

  return {
    buy: {
      totalRoyaltyPay: buyNftsRoyaltyData.totalRoyaltyPay.add(
        buyPnftsRoyaltyData.totalRoyaltyPay,
      ),
      pnft: buyPnftsRoyaltyData,
      nft: buyNftsRoyaltyData,
    },
    sell: {
      totalRoyaltyPay: sellNftsRoyaltyData.totalRoyaltyPay.add(
        sellPnftsRoyaltyData.totalRoyaltyPay,
      ),
      pnft: sellPnftsRoyaltyData,
      nft: sellNftsRoyaltyData,
    },
  };
};

export interface CrossMintConfig {
  type: string;
  mintHash: string;
  pairPublicKey: string;
}

export type CartItemsPayRoyalties = ReturnType<typeof getCartItemsPayRoyalties>;

type UseCartSider = () => {
  cartItems: {
    buy: CartOrder[];
    sell: CartOrder[];
  };
  cartOpened: boolean;
  isCartEmpty: boolean;
  invalidItems: CartOrder[];
  itemsAmount: number;
  totalBuy: number;
  totalSell: number;
  isOneBuyNft: boolean;
  crossmintConfig: CrossMintConfig;
  payRoyalties: CartItemsPayRoyalties;
};

export const useCartSider: UseCartSider = () => {
  const cartItems = useSelector(selectCartItems);
  const cartOpened = useSelector(selectCartSiderVisible);
  const invalidItems = useSelector(selectAllInvalidCartOrders);
  const isCartEmpty = useSelector(selectIsCartEmpty);

  const itemsAmount = cartItems.buy.length + cartItems.sell.length;
  const totalBuy = cartItems.buy.reduce((acc, item) => acc + item.price, 0);
  const totalSell = cartItems.sell.reduce((acc, item) => acc + item.price, 0);

  const isOneBuyNft = cartItems.buy.length === 1;
  const crossmintConfig = {
    type: cartItems?.buy[0]?.name,
    mintHash: cartItems?.buy[0]?.mint,
    pairPublicKey: cartItems?.buy[0]?.targetPairPukey,
  };

  const payRoyalties = getCartItemsPayRoyalties(cartItems);

  return {
    cartItems,
    cartOpened,
    isCartEmpty,
    invalidItems,
    itemsAmount,
    totalBuy,
    totalSell,
    isOneBuyNft,
    crossmintConfig,
    payRoyalties,
  };
};

type UseSwap = (params: {
  onAfterTxn?: () => void;
  onFail?: () => void;
  ixsPerTxn?: number;
  onSuccessTxn?: () => void;
  payRoyalty?: boolean;
}) => {
  swap: () => Promise<void>;
};

export const useSwap: UseSwap = ({
  onAfterTxn,
  onSuccessTxn,
  onFail,
  ixsPerTxn = 1,
  payRoyalty,
}) => {
  const connection = useConnection();
  const wallet = useWallet();
  const dispatch = useDispatch();

  const orders = useSelector(selectCartPendingOrders);
  const pairs = useSelector(selectCartPairs);

  const swap = async () => {
    const ordersArray = Object.values(orders).flat();
    const ordersByMint = keyBy(ordersArray, 'mint');

    const ixsData = await Promise.all(
      ordersArray.map((order) =>
        createIx({
          connection,
          walletPubkey: wallet.publicKey,
          pair: pairs[order.targetPairPukey],
          order,
          payRoyalty,
        }),
      ),
    );

    const ixsDataChunks = chunk(ixsData, ixsPerTxn);

    const txnsDataWithMint = ixsDataChunks.map((ixsAndSigners) =>
      mergeIxsIntoTxn(ixsAndSigners),
    );

    const txnsDataArr: TxnData[] = txnsDataWithMint.map((txn) => ({
      signers: txn.signers,
      transaction: txn.transaction,
      loadingModalCard: txn.nftMints.map((mint) =>
        createIxCardFuncs[IX_TYPE.COMPLETE_ORDER](
          ordersByMint?.[mint],
          payRoyalty,
        ),
      ),
      onSuccess: () => {
        txn.nftMints.map((nftMint) => {
          dispatch(coreActions.addFinishedOrderMint(nftMint));
        });
        onSuccessTxn?.();
      },
    }));

    const txnsData = getTxnsDataOneByOne(txnsDataArr, dispatch);
    const closeModal = () => {
      dispatch(txsLoadingModalActions.setVisible(false));
    };

    try {
      await signAndSendTransactionsOneByOne({
        txnsData,
        connection,
        wallet,
        closeModal,
      });
      onAfterTxn?.();
      dispatch(commonActions.setCartSider({ isVisible: false }));
    } catch {
      notify({
        message: 'oops... something went wrong!',
        type: NotifyType.ERROR,
      });
      onFail?.();
    } finally {
      closeModal();
    }
  };

  return {
    swap,
  };
};

type UseExchangeData = (params: { rawSolAmount: number }) => {
  amount: JSBI;
  tokenAmount: string;
  exchangeLoading: boolean;
  exchangeFetching: boolean;
  tokenExchange: TokenItem;
  rate: number;
};

export const useExchangeData: UseExchangeData = ({ rawSolAmount }) => {
  const tokenExchange = useSelector(selectTokenExchange);

  const { tokensData, tokensLoading, tokensFetching } = useTokenInfo({
    tokenValue: tokenExchange?.value,
  });
  const { tokenRate, rateLoading, rateFetching } = useTokenRate({
    tokenValue: tokenExchange?.value,
  });

  const inputTokenInfo = useMemo(() => {
    return tokensData?.find((item) => item.address === tokenExchange?.value);
  }, [tokensData, tokenExchange?.value]);

  const { amount, tokenAmount, rate } = useMemo(
    () => calcAmount(rawSolAmount, inputTokenInfo?.decimals, tokenRate?.price),
    [rawSolAmount, inputTokenInfo, tokenRate],
  );

  return {
    amount,
    tokenAmount,
    tokenExchange,
    rate,
    exchangeLoading: tokensLoading || rateLoading,
    exchangeFetching: tokensFetching || rateFetching,
  };
};
