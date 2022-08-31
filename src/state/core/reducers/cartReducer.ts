import { createReducer } from 'typesafe-actions';
import { Dictionary } from 'lodash';
import { coreActions, coreTypes } from '../actions';
import { CartOrder, CartPair, OrderType } from '../types';
import {
  calcNextSpotPrice,
  changePairOnOrderAdd,
  changePairOnOrderRemove,
  computeNewCartStateAfterBuyOrderRemove,
  computeNewCartStateAfterSellOrderRemove,
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

    const affectedPair: CartPair = state.pairs?.[payloadPair.pairPubkey] || {
      ...payloadPair,
      takenMints: [],
    };

    const nextSpotPrice = calcNextSpotPrice(affectedPair, orderType);

    const appendableOrder: CartOrder = {
      type: orderType,
      targetPairPukey: affectedPair.pairPubkey,
      price: isBuyOrder ? nextSpotPrice : affectedPair.spotPrice,

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

    const affectedPairAfterChanges: CartPair = changePairOnOrderAdd(
      affectedPair,
      appendableOrder,
    );

    return {
      pairs: {
        ...state.pairs,
        [affectedPairAfterChanges.pairPubkey]: affectedPairAfterChanges,
      },
      orders: {
        ...state.orders,
        [affectedPairAfterChanges.pairPubkey]: [
          ...(state.orders[affectedPairAfterChanges.pairPubkey] || []),
          appendableOrder,
        ],
      },
    };
  },
  [coreTypes.REMOVE_ORDER]: (
    state,
    { payload }: ReturnType<typeof coreActions.removeOrder>,
  ) => {
    const { mint: removableMint } = payload;

    const removableOrder = findCartOrder(removableMint, state.orders);

    const { type: orderType, targetPairPukey: cartPairPubkey } = removableOrder;
    const isBuyOrder = orderType === OrderType.BUY;

    const affectedPair = state.pairs[cartPairPubkey];

    const affectedPairAfterChanges = changePairOnOrderRemove(
      affectedPair,
      removableOrder,
    );

    if (!isBuyOrder) {
      return computeNewCartStateAfterSellOrderRemove(
        state,
        affectedPairAfterChanges,
        removableOrder,
      );
    }

    return computeNewCartStateAfterBuyOrderRemove(
      state,
      affectedPairAfterChanges,
      removableOrder,
    );
  },
});
