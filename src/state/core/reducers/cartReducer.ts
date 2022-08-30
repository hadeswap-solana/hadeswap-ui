import { createReducer } from 'typesafe-actions';
import { Dictionary } from 'lodash';
import { coreActions, coreTypes } from '../actions';
import { CartOrder, CartPair, OrderType } from '../types';
import {
  calcNextSpotPrice,
  convertCartOrderToPairSellOrder,
  findCartOrder,
} from '../helpers';

export type CartState = {
  pairs: Dictionary<CartPair>;
  orders: Dictionary<CartOrder[]>;
};

const initialCartState: CartState = {
  pairs: {},
  orders: {},
};

export const cartReducer = createReducer<CartState>(initialCartState, {
  [coreTypes.ADD_ORDER]: (
    state,
    { payload }: ReturnType<typeof coreActions.addOrder>,
  ) => {
    const { pair: payloadPair, order: payloadOrder, orderType } = payload;
    const isBuyOrder = orderType === OrderType.BUY;

    const pairBeforeChanges: CartPair = state.pairs?.[
      payloadPair.pairPubkey
    ] || {
      ...payloadPair,
      takenMints: [],
    };

    const nextSpotPrice = calcNextSpotPrice(pairBeforeChanges, orderType);

    const order: CartOrder = {
      type: orderType,
      targetPairPukey: pairBeforeChanges.pairPubkey,
      price: isBuyOrder ? nextSpotPrice : pairBeforeChanges.spotPrice,

      mint: payloadOrder.mint,
      imageUrl: payloadOrder.imageUrl,
      name: payloadOrder.name,
      traits: payloadOrder.traits,
      collectionName: payloadOrder.collectionName,
      market: payloadOrder.market,

      nftPairBox: isBuyOrder ? payloadOrder.nftPairBox : null,
      vaultNftTokenAccount: isBuyOrder
        ? payloadOrder.vaultNftTokenAccount
        : null,
      nftValidationAdapter: !isBuyOrder
        ? payloadOrder.nftValidationAdapter
        : null,
    };

    const pairAfterChanges: CartPair = {
      ...pairBeforeChanges,
      nftsCount: isBuyOrder
        ? pairBeforeChanges.nftsCount - 1
        : pairBeforeChanges.nftsCount,
      buyOrdersAmount: isBuyOrder
        ? pairBeforeChanges.buyOrdersAmount
        : pairBeforeChanges.buyOrdersAmount - 1,
      spotPrice: nextSpotPrice,
      sellOrders:
        pairBeforeChanges?.sellOrders?.filter(
          ({ mint }) => mint !== order.mint,
        ) || [],
      takenMints: [...pairBeforeChanges.takenMints, order.mint],
    };

    return {
      pairs: {
        ...state.pairs,
        [pairAfterChanges.pairPubkey]: pairAfterChanges,
      },
      orders: {
        ...state.orders,
        [pairAfterChanges.pairPubkey]: [
          ...(state.orders[pairAfterChanges.pairPubkey] || []),
          order,
        ],
      },
    };
  },
  [coreTypes.REMOVE_ORDER]: (
    state,
    { payload }: ReturnType<typeof coreActions.removeOrder>,
  ) => {
    const { mint: removableMint } = payload;

    const cartOrder = findCartOrder(removableMint, state.orders);

    const { type: orderType, targetPairPukey: cartPairPubkey } = cartOrder;
    const isBuyOrder = orderType === OrderType.BUY;

    const linkedPair = state.pairs[cartPairPubkey];

    const nextSpotPrice = calcNextSpotPrice(
      linkedPair,
      isBuyOrder ? OrderType.SELL : OrderType.BUY,
    );

    const pair = {
      ...linkedPair,
      spotPrice: nextSpotPrice,
      nftsCount: isBuyOrder ? linkedPair.nftsCount + 1 : linkedPair.nftsCount,
      buyOrdersAmount: isBuyOrder
        ? linkedPair.buyOrdersAmount
        : linkedPair.buyOrdersAmount + 1,
      takenMints: linkedPair.takenMints.filter(
        (mint) => mint !== cartOrder.mint,
      ),
      sellOrders: isBuyOrder
        ? [...linkedPair.sellOrders, convertCartOrderToPairSellOrder(cartOrder)]
        : [],
    };

    //TODO: Implement cross-pair calc for Sell orders

    const remainingOrders: CartOrder[] = state.orders[cartPairPubkey]
      .filter(({ mint }) => mint !== cartOrder.mint)
      .sort((a, b) => a.price - b.price);

    if (isBuyOrder) {
      const mostExpensiveOrder = remainingOrders.at(-1);

      if (mostExpensiveOrder && mostExpensiveOrder.price > cartOrder.price) {
        mostExpensiveOrder.price = cartOrder.price;
      }
    } else {
      const cheapestOrder = remainingOrders.at(0);

      if (cheapestOrder && cheapestOrder.price < cartOrder.price) {
        cheapestOrder.price = cartOrder.price;
      }
    }

    return {
      pairs: {
        ...state.pairs,
        [pair.pairPubkey]: pair.takenMints.length ? pair : null,
      },
      orders: { ...state.orders, [pair.pairPubkey]: remainingOrders },
    };
  },
});
