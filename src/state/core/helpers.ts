import { Dictionary, clone } from 'lodash';
import { hadeswap } from 'hadeswap-sdk';
import {
  BasePair,
  CartOrder,
  CartPair,
  OrderType,
  Pair,
  PairSellOrder,
  PairUpdate,
} from './types';
import { CartState } from './reducers/cartReducer';

const { OrderType: HadeOrderType, BondingCurveType } = hadeswap.types;

export const getSellOrderCartPairIndex = (
  orderMint: string,
  sellOrdersCartMints: string[],
): number => sellOrdersCartMints.indexOf(orderMint);

export const calcNextSpotPrice = (
  pair: BasePair,
  orderType: OrderType,
): number => {
  return hadeswap.helpers.calculateNextSpotPrice({
    orderType:
      orderType === OrderType.BUY ? HadeOrderType.Buy : HadeOrderType.Sell,
    spotPrice: pair.baseSpotPrice,
    delta: pair.delta,
    bondingCurveType:
      pair.bondingCurve === 'linear'
        ? BondingCurveType.Linear
        : BondingCurveType.Exponential,
    counter: pair.mathCounter,
  });
};

export const convertCartOrderToPairSellOrder = (
  order: CartOrder,
): PairSellOrder => ({
  mint: order.mint,
  imageUrl: order.imageUrl,
  nftPairBox: order.nftPairBox,
  vaultTokenAccount: order.vaultTokenAccount,
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

export const changePairOnOrderAdd = (
  affectedPair: CartPair,
  appendableOrder: CartOrder,
): CartPair => {
  const isTakerBuyOrder = appendableOrder.type === OrderType.BUY;

  return {
    ...affectedPair,
    nftsCount: isTakerBuyOrder
      ? affectedPair.nftsCount - 1
      : affectedPair.nftsCount,
    buyOrdersAmount: isTakerBuyOrder
      ? affectedPair.buyOrdersAmount
      : affectedPair.buyOrdersAmount - 1,
    currentSpotPrice: calcNextSpotPrice(affectedPair, appendableOrder.type),
    mathCounter: isTakerBuyOrder
      ? affectedPair.mathCounter + 1
      : affectedPair.mathCounter - 1,
    sellOrders:
      affectedPair?.sellOrders?.filter(
        ({ mint }) => mint !== appendableOrder.mint,
      ) || [],
    takenMints: [...affectedPair.takenMints, appendableOrder.mint],
  };
};

export const changePairOnOrderRemove = (
  affectedPair: CartPair,
  removableOrder: CartOrder,
): CartPair => {
  const isTakerBuyOrder = removableOrder.type === OrderType.BUY;

  return {
    ...affectedPair,
    currentSpotPrice: calcNextSpotPrice(
      affectedPair,
      isTakerBuyOrder ? OrderType.SELL : OrderType.BUY,
    ),
    mathCounter: isTakerBuyOrder
      ? affectedPair.mathCounter - 1
      : affectedPair.mathCounter + 1,
    nftsCount: isTakerBuyOrder
      ? affectedPair.nftsCount + 1
      : affectedPair.nftsCount,
    buyOrdersAmount: isTakerBuyOrder
      ? affectedPair.buyOrdersAmount
      : affectedPair.buyOrdersAmount + 1,
    takenMints: affectedPair.takenMints.filter(
      (mint) => mint !== removableOrder.mint,
    ),
    sellOrders: isTakerBuyOrder
      ? [
          ...affectedPair.sellOrders,
          convertCartOrderToPairSellOrder(removableOrder),
        ]
      : [...(affectedPair.sellOrders || [])],
  };
};

export const computeNewCartStateAfterBuyOrderRemove = (
  state: CartState,
  affectedPair: CartPair,
  removableOrder: CartOrder,
): CartState => {
  const remainingOrdersForPair: CartOrder[] = state.pendingOrders[
    affectedPair.pairPubkey
  ]
    .filter(({ mint }) => mint !== removableOrder.mint)
    .sort((a, b) => a.price - b.price);

  const mostExpensiveOrder = remainingOrdersForPair.at(-1);

  if (mostExpensiveOrder && mostExpensiveOrder.price > removableOrder.price) {
    mostExpensiveOrder.price = removableOrder.price;
  }

  const nextState = {
    ...state,
    pairs: {
      ...state.pairs,
      [affectedPair.pairPubkey]: clone(affectedPair),
    },
    pendingOrders: {
      ...state.pendingOrders,
      [affectedPair.pairPubkey]: remainingOrdersForPair,
    },
  };

  return nextState;
};

export const computeNewCartStateAfterSellOrderRemove = (
  state: CartState,
  affectedPair: CartPair,
  removableOrder: CartOrder,
): CartState => {
  const remainingOrdersByMarket: CartOrder[] = Object.values(
    state.pendingOrders,
  )
    .flat()
    .filter(({ market }) => market === removableOrder.market)
    .filter(({ mint }) => mint !== removableOrder.mint)
    .sort((a, b) => b.price - a.price);

  const cheapestOrder = remainingOrdersByMarket.at(-1);

  if (cheapestOrder && cheapestOrder.price < removableOrder.price) {
    if (cheapestOrder.targetPairPukey === removableOrder.targetPairPukey) {
      //* Just change price
      cheapestOrder.price = removableOrder.price;
    } else {
      //* Crosspair changes
      //? 1. Remove cheapestOrder from its pair
      //? 2. Change cheapestOrder pair info
      //? 3. Change cheapestOrder price and targetPair
      //? 4. Put cheapestOrder into affectedPair
      //? 5. Compute state

      const cheapestOrderPair = state.pairs[cheapestOrder.targetPairPukey];

      const nextCheapestOrderPair = changePairOnOrderRemove(
        cheapestOrderPair,
        cheapestOrder,
      );

      cheapestOrder.targetPairPukey = removableOrder.targetPairPukey;
      cheapestOrder.price = removableOrder.price;

      const affectedPairAfterChages = changePairOnOrderAdd(
        affectedPair,
        cheapestOrder,
      );

      return {
        ...state,
        pairs: {
          ...state.pairs,
          [nextCheapestOrderPair.pairPubkey]: nextCheapestOrderPair.takenMints
            .length
            ? nextCheapestOrderPair
            : null,
          [affectedPairAfterChages.pairPubkey]: affectedPairAfterChages,
        },
        pendingOrders: {
          ...state.pendingOrders,
          [cheapestOrderPair.pairPubkey]: state.pendingOrders[
            cheapestOrderPair.pairPubkey
          ].filter(({ mint }) => mint !== cheapestOrder.mint),

          [affectedPairAfterChages.pairPubkey]: [
            ...(state.pendingOrders[affectedPairAfterChages.pairPubkey]?.filter(
              ({ mint }) => mint !== removableOrder.mint,
            ) || []),
            cheapestOrder,
          ],
        },
      };
    }
  }

  return {
    ...state,
    pairs: {
      ...state.pairs,
      [affectedPair.pairPubkey]: affectedPair,
    },
    pendingOrders: {
      ...state.pendingOrders,
      [affectedPair.pairPubkey]: state.pendingOrders[
        affectedPair.pairPubkey
      ].filter(({ mint }) => mint !== removableOrder.mint),
    },
  };
};

export const findInvalidBuyOrders = (
  pairUpdate: PairUpdate,
  pairOrders: CartOrder[],
): CartOrder[] => {
  if (pairUpdate?.sellOrdersMints) {
    return pairOrders.filter(
      ({ mint, type }) =>
        type === OrderType.BUY && !pairUpdate.sellOrdersMints?.includes(mint),
    );
  }

  return [];
};

export const findInvalidSellOrders = (
  pairUpdate: PairUpdate,
  pairOrders: CartOrder[],
): CartOrder[] => {
  const sellOrders = pairOrders.filter(({ type }) => type === OrderType.SELL);
  return sellOrders.slice(pairUpdate.buyOrdersAmount);
};

export const findValidOrders = (
  allOrders: CartOrder[],
  invalidOrders: CartOrder[],
): CartOrder[] => {
  const invalidMints = invalidOrders.map(({ mint }) => mint);

  return allOrders.filter(({ mint }) => !invalidMints.includes(mint));
};

export const findSellOrders = (orders: CartOrder[]): CartOrder[] => {
  return orders.filter(({ type }) => type === OrderType.SELL);
};
