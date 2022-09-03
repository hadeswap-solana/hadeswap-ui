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
  pendingOrders: Dictionary<CartOrder[]>;
  finishedOrdersMints: string[];
};

const initialCartState: CartState = {
  pairs: {},
  pendingOrders: {},
  finishedOrdersMints: [],
};

export const cartReducer = createReducer<CartState>(initialCartState, {
  [coreTypes.ADD_ORDER_TO_CART]: (
    state,
    { payload }: ReturnType<typeof coreActions.addOrderToCart>,
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
      vaultTokenAccount: isBuyOrder ? payloadOrder.vaultTokenAccount : null,
      nftValidationAdapter: !isBuyOrder
        ? payloadOrder.nftValidationAdapter
        : null,
    };

    const affectedPairAfterChanges: CartPair = changePairOnOrderAdd(
      affectedPair,
      appendableOrder,
    );

    return {
      ...state,
      pairs: {
        ...state.pairs,
        [affectedPairAfterChanges.pairPubkey]: affectedPairAfterChanges,
      },
      pendingOrders: {
        ...state.pendingOrders,
        [affectedPairAfterChanges.pairPubkey]: [
          ...(state.pendingOrders[affectedPairAfterChanges.pairPubkey] || []),
          appendableOrder,
        ],
      },
    };
  },
  [coreTypes.REMOVE_ORDER_FROM_CART]: (
    state,
    { payload }: ReturnType<typeof coreActions.removeOrderFromCart>,
  ) => {
    const { mint: removableMint } = payload;

    const removableOrder = findCartOrder(removableMint, state.pendingOrders);

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
  [coreTypes.ADD_FINISHED_ORDER_MINT]: (
    state,
    { payload }: ReturnType<typeof coreActions.addFinishedOrderMint>,
  ) => {
    return {
      ...state,
      finishedOrdersMints: [...state.finishedOrdersMints, payload.mint],
    };
  },
});
