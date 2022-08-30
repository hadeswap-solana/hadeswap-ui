import { Dictionary } from 'lodash';
import { SellOrder } from './actions/cartActions';
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
