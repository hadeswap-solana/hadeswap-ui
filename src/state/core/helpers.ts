import { Dictionary } from 'lodash';
import { hadeswap } from 'hadeswap-sdk';
import {
  BasePair,
  CartOrder,
  CartPair,
  OrderType,
  Pair,
  PairSellOrder,
} from './types';

const { OrderType: HadeOrderType, BondingCurveType } = hadeswap.types;

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

export const calcNextSpotPrice = (
  pair: BasePair,
  orderType: OrderType,
): number => {
  return hadeswap.helpers.next_spot_price({
    orderType:
      orderType === OrderType.BUY ? HadeOrderType.Buy : HadeOrderType.Sell,
    spot_price: pair.spotPrice,
    delta: pair.delta,
    bondingCurveType:
      pair.bondingCurve === 'linear'
        ? BondingCurveType.Linear
        : BondingCurveType.Exponential,
  });
};

export const convertCartOrderToPairSellOrder = (
  order: CartOrder,
): PairSellOrder => ({
  mint: order.mint,
  imageUrl: order.imageUrl,
  nftPairBox: order.nftPairBox,
  vaultNftTokenAccount: order.vaultNftTokenAccount,
  name: order.name,
  traits: order.traits,
});

export const findCartOrder = (
  nftMint: string,
  orders: Dictionary<CartOrder[]>,
): CartOrder | null =>
  Object.values(orders)
    .flat()
    .find(({ mint }) => mint === nftMint) || null;

export const convertCartPairToMarketPair = (cartPair: CartPair): Pair => {
  const cartPairCopy: CartPair = { ...cartPair };
  delete cartPairCopy.takenMints;
  return cartPairCopy;
};
