import { Dictionary, countBy } from 'lodash';
import { BuyOrder, SellOrder } from './actions/cartActions';
import { Pair } from './types';

export const getSellOrdersMintsByPair = (
  pairPubkey: string,
  sellOrdersInCartByPair: Dictionary<SellOrder[]>,
): string[] => {
  const sellOrdersCart: SellOrder[] = sellOrdersInCartByPair[pairPubkey] || [];

  return sellOrdersCart.map(({ mint }) => mint);
};

export const getSellOrderCartPairIndex = (
  orderMint: string,
  sellOrdersCartMints: string[],
): number => sellOrdersCartMints.indexOf(orderMint);

export const calcSellOrderPrice = (
  sellOrderCartPairIndex: number,
  sellOrdersCartMints: string[],
  pair: Pair,
): number => {
  return sellOrderCartPairIndex !== -1
    ? pair.spotPrice + pair.delta * (sellOrderCartPairIndex + 1)
    : pair.spotPrice + pair.delta * (sellOrdersCartMints.length + 1);
};

export const getPairOccurrencesInOrdersArray = (
  buyOrders: BuyOrder[] = [],
): Dictionary<number> => {
  return countBy(buyOrders.map(({ pair }) => pair));
};

export const getPairsNextPriceBuy = (
  pairs: Pair[] = [],
  buyOrders: BuyOrder[] = [],
): Dictionary<number> => {
  const pairsOccurrences = getPairOccurrencesInOrdersArray(buyOrders);

  return Object.fromEntries(
    pairs
      .filter((pair) => pair.type !== 'nftForToken')
      .map(({ pairPubkey, delta, spotPrice, buyOrdersAmount }) => {
        const occurrences = pairsOccurrences[pairPubkey] || 0;

        const nextBuyPrice =
          occurrences === buyOrdersAmount
            ? -1
            : spotPrice - delta * occurrences;

        return [pairPubkey, nextBuyPrice];
      }),
  );
};
