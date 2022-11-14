import { createSelector } from 'reselect';
import { OrderType, MarketOrder } from '../types';
import {
  calcNextSpotPrice,
  calcPriceWithFee,
  createPoolTableRow,
} from '../helpers';
import { selectCertainMarket, selectAllMarkets } from './marketSelectors';
import { selectWalletPairs } from './pairSelectors';
import {
  selectMarketPairs,
  selectRawMarketPairs,
} from './marketPairsSelectors';
import {
  selectCartFinishedOrdersMints,
  selectCartPairs,
  selectCartPendingOrders,
} from './cartSelectors';
import { selectMarketWalletNfts } from './marketWalletNftsSelectors';
import { keyBy } from 'lodash';

export const selectPoolsTableInfo = createSelector(
  [selectCertainMarket, selectRawMarketPairs],
  (marketInfo, pairs) =>
    pairs.map((pair) => {
      return createPoolTableRow(pair, marketInfo);
    }),
);

export const selectAllBuyOrdersForMarket = createSelector(
  [selectMarketPairs, selectCartPairs, selectCartPendingOrders],
  (marketPairs, cartPairs, cartOrders) => {
    return marketPairs
      .reduce((orders: MarketOrder[], pair) => {
        const selectedPairOrders: MarketOrder[] =
          cartOrders[pair.pairPubkey]
            ?.filter(({ type }) => type === OrderType.BUY)
            ?.map((order) => ({
              ...order,
              selected: true,
            })) || [];

        const cartPair = cartPairs[pair.pairPubkey];

        const freePairOrders: MarketOrder[] =
          pair?.sellOrders?.map((sellOrder) => ({
            ...sellOrder,
            type: OrderType.BUY,
            targetPairPukey: pair.pairPubkey,
            price: calcPriceWithFee(
              calcNextSpotPrice(cartPair || pair, OrderType.BUY),
              pair.fee,
              OrderType.BUY,
            ),
            mathCounter: pair.mathCounter,
            selected: false,
          })) || [];

        return [...orders, ...selectedPairOrders, ...freePairOrders];
      }, [])
      .sort(
        (a: MarketOrder, b: MarketOrder) =>
          a.price - b.price || a?.name?.localeCompare(b?.name),
      ) as MarketOrder[];
  },
);

export const selectAllSellOrdersForMarket = createSelector(
  [
    selectMarketPairs,
    selectCartPendingOrders,
    selectCartFinishedOrdersMints,
    selectMarketWalletNfts,
    (_, marketPublicKey: string) => marketPublicKey,
  ],
  (
    marketPairs,
    cartOrders,
    cartFinishedOrdersMints,
    marketWalletNfts,
    marketPublicKey,
  ) => {
    const pairs = marketPairs
      .filter(({ type }) => type !== 'nftForToken')
      .filter(({ buyOrdersAmount }) => buyOrdersAmount > 0)
      .sort(
        (a, b) =>
          calcPriceWithFee(a.currentSpotPrice, a.fee, OrderType.SELL) -
          calcPriceWithFee(b.currentSpotPrice, b.fee, OrderType.SELL),
      );

    const bestPair = pairs.at(-1);

    const cartSellOrders: MarketOrder[] = Object.values(cartOrders)
      .flat()
      .filter(({ type }) => type === OrderType.SELL)
      .map((order) => ({
        ...order,
        selected: true,
      }))
      .filter(({ market }) => market === marketPublicKey);

    const sellOrders: MarketOrder[] =
      marketWalletNfts
        .filter(
          ({ mint }) =>
            !cartSellOrders.find(({ mint: cartMint }) => cartMint === mint),
        )
        .map((nft) => {
          return {
            ...nft,
            type: OrderType.SELL,
            targetPairPukey:
              bestPair?.pairPubkey || '11111111111111111111111111111111',
            price:
              calcPriceWithFee(
                bestPair?.currentSpotPrice,
                bestPair?.fee ?? 0,
                OrderType.SELL,
              ) || -1,
            mathCounter: bestPair?.mathCounter,
            selected: false,
          };
        })
        .filter(({ mint }) => !cartFinishedOrdersMints.includes(mint)) || [];

    return [...cartSellOrders, ...sellOrders].sort(
      (a: MarketOrder, b: MarketOrder) =>
        b.price - a.price || a?.name?.localeCompare(b?.name),
    ) as MarketOrder[];
  },
);

export const selectMyPoolsPageTableInfo = createSelector(
  [selectAllMarkets, selectWalletPairs],
  (markets, pairs) => {
    const marketByPubkey = keyBy(markets, 'marketPubkey');

    return pairs.map((pair) => {
      return createPoolTableRow(pair, marketByPubkey[pair.market]);
    });
  },
);
