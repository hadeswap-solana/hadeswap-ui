import { createReducer } from 'typesafe-actions';
import { Dictionary, clone } from 'lodash';
import { coreActions, coreTypes } from '../actions';
import { CartOrder, CartPair, OrderType } from '../types';
import { Tokens } from '../../../types';
import {
  calcNextSpotPrice,
  calcPriceWithFee,
  changePairOnOrderAdd,
  changePairOnOrderRemove,
  computeNewCartStateAfterBuyOrderRemove,
  computeNewCartStateAfterSellOrderRemove,
  findCartOrder,
  findInvalidBuyOrders,
  findInvalidSellOrders,
  findSellOrders,
  findValidOrders,
} from '../helpers';

export type CartState = {
  pairs: Dictionary<CartPair>;
  pendingOrders: Dictionary<CartOrder[]>;
  invalidOrders: Dictionary<CartOrder[]>;
  finishedOrdersMints: string[];
  exchangeToken: Tokens;
};

const initialCartState: CartState = {
  pairs: {},
  pendingOrders: {},
  invalidOrders: {},
  finishedOrdersMints: [],
  exchangeToken: null,
};

const removeInvalidMintsFromCartPair = (
  pair: CartPair,
  invalidOrders: CartOrder[],
) => {
  const invalidMints = invalidOrders.map(({ mint }) => mint);
  const takenMints =
    pair?.takenMints.filter((mint) => !invalidMints.includes(mint)) || [];

  return { ...pair, takenMints };
};

export const cartReducer = createReducer<CartState>(initialCartState, {
  [coreTypes.UPDATE_PAIRS]: (
    state,
    { payload: pairsUpdates }: ReturnType<typeof coreActions.updatePairs>,
  ) => {
    const nextState = clone(state);

    pairsUpdates.forEach((pairUpdate) => {
      const affectedPair = state.pairs[pairUpdate.pairPubkey];

      if (!affectedPair) {
        return;
      }

      const oldOrders = nextState.pendingOrders[pairUpdate.pairPubkey] || [];

      //? Find invalid orders
      const invalidBuyOrders = findInvalidBuyOrders(pairUpdate, oldOrders);
      const invalidSellOrders = findInvalidSellOrders(pairUpdate, oldOrders);
      const allInvalidOrders = [...invalidBuyOrders, ...invalidSellOrders];

      //? Set invalid orders in store
      nextState.invalidOrders[pairUpdate.pairPubkey] = [
        ...(nextState.invalidOrders[pairUpdate.pairPubkey] || []),
        ...allInvalidOrders,
      ];

      //? Get valid orders
      const validOrders = findValidOrders(oldOrders, allInvalidOrders);
      const validSellOrders = findSellOrders(validOrders);

      //? Remove invalid orders from taken mints
      const pairWithValidOrders = removeInvalidMintsFromCartPair(
        affectedPair,
        allInvalidOrders,
      );

      //? Loop that creates new orders and pair
      const mutablePair = {
        ...pairWithValidOrders,
        currentSpotPrice: pairUpdate.currentSpotPrice,
        baseSpotPrice: pairUpdate.baseSpotPrice,
        mathCounter: pairUpdate.mathCounter,
        buyOrdersAmount: pairUpdate.buyOrdersAmount - validSellOrders.length,
      };
      const changedOrders = [];
      for (let i = 0; i < validOrders.length; ++i) {
        const order = validOrders[i];
        const isTakerBuyOrder = order.type === OrderType.BUY;
        const nextSpotPrice = calcNextSpotPrice(mutablePair, order.type);
        const changedOrder = {
          ...order,
          price: isTakerBuyOrder
            ? calcPriceWithFee(nextSpotPrice, mutablePair.fee, OrderType.BUY)
            : calcPriceWithFee(
              mutablePair.currentSpotPrice,
              mutablePair.fee,
              OrderType.SELL,
            ),
        };
        changedOrders.push(changedOrder);

        mutablePair.mathCounter = isTakerBuyOrder
          ? mutablePair.mathCounter + 1
          : mutablePair.mathCounter - 1;
        mutablePair.currentSpotPrice = nextSpotPrice;
      }

      nextState.pairs[pairUpdate.pairPubkey] = mutablePair;
      nextState.pendingOrders[pairUpdate.pairPubkey] = changedOrders;
    });

    return nextState;
  },
  [coreTypes.CLEAR_INVALID_ORDERS]: (state) => {
    return {
      ...state,
      invalidOrders: {},
    };
  },
  [coreTypes.CLEAR_CART]: () => {
    return initialCartState;
  },
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
      price: isBuyOrder
        ? calcPriceWithFee(nextSpotPrice, affectedPair.fee, OrderType.BUY)
        : calcPriceWithFee(
          affectedPair.currentSpotPrice,
          affectedPair.fee,
          OrderType.SELL,
        ),

      mint: payloadOrder.mint,
      imageUrl: payloadOrder.imageUrl,
      name: payloadOrder.name,
      traits: payloadOrder.traits,
      collectionName: payloadOrder.collectionName,
      rarity: payloadOrder.rarity || null,
      market: payloadOrder.market,
      mathCounter: payloadOrder.mathCounter,
      nftPairBox: isBuyOrder ? payloadOrder.nftPairBox : null,
      vaultTokenAccount: isBuyOrder ? payloadOrder.vaultTokenAccount : null,
      nftValidationAdapter: !isBuyOrder
        ? payloadOrder?.nftValidationAdapter
        : null,
      nftValidationAdapterV2:
        !isBuyOrder && payloadOrder?.nftValidationAdapterV2,
      validProof: !isBuyOrder && payloadOrder?.validProof,
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
  [coreTypes.REPLACE_BUY_ORDER]: (
    state,
    { payload }: ReturnType<typeof coreActions.replaceBuyOrder>,
  ) => {
    const { pairPublicKey, prevOrderMint, nextOrder } = payload;

    const prevOrder = state.pendingOrders[pairPublicKey]?.find(
      ({ mint }) => mint === prevOrderMint,
    );

    if (!prevOrder) return state;

    const pendingOrdersWithRemovedPrevOrder = state.pendingOrders[
      pairPublicKey
      ].filter(({ mint }) => mint !== prevOrderMint);

    return {
      ...state,
      pendingOrders: {
        ...state.pendingOrders,
        [pairPublicKey]: [
          ...pendingOrdersWithRemovedPrevOrder,
          {
            ...nextOrder,
            type: prevOrder.type,
            targetPairPukey: prevOrder.targetPairPukey,
            price: prevOrder.price,
            mathCounter: prevOrder.mathCounter,
          },
        ],
      },
    };
  },
  [coreTypes.EXCHANGE_TOKEN]: (state, { payload }: ReturnType<typeof coreActions.exchangeToken>) => {
    return {
      ...state,
      exchangeToken: payload.token,
    };
  }
});
