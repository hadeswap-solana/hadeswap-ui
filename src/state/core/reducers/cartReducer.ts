import { createReducer } from 'typesafe-actions';
import { Dictionary } from 'lodash';
import { coreActions, coreTypes } from '../actions';
import { SellOrder, BuyOrder } from '../actions/cartActions';

export type CartState = {
  buy: Dictionary<SellOrder[]>;
  sell: Dictionary<BuyOrder[]>;
};

const initialCartState: CartState = {
  buy: {},
  sell: {},
};

export const cartReducer = createReducer<CartState>(initialCartState, {
  [coreTypes.ADD_BUY_ITEM]: (
    state,
    { payload }: ReturnType<typeof coreActions.addBuyItem>,
  ) => {
    const ordersByPair = state.buy?.[payload.pair] || [];

    return {
      ...state,
      buy: { ...state.buy, [payload.pair]: [...ordersByPair, payload] },
    };
  },
  [coreTypes.REMOVE_BUY_ITEM]: (
    state,
    { payload }: ReturnType<typeof coreActions.removeBuyItem>,
  ) => {
    const pairOrders = state.buy?.[payload.pair];

    const isLastIndex =
      pairOrders.map(({ mint }) => mint).indexOf(payload.mint) ===
      pairOrders.length;

    const filteredOrders = pairOrders.filter(
      ({ mint }) => mint !== payload.mint,
    );

    const nextOrders = isLastIndex
      ? filteredOrders
      : filteredOrders.map((order, idx) => ({
          ...order,
          price: order.spotPrice + order.delta * (idx + 1),
        }));

    return {
      ...state,
      buy: { ...state.buy, [payload.pair]: nextOrders },
    };
  },

  [coreTypes.ADD_SELL_ITEM]: (
    state,
    { payload }: ReturnType<typeof coreActions.addSellItem>,
  ) => {
    const ordersByPair = state.sell?.[payload.pair] || [];
    return {
      ...state,
      sell: {
        ...state.sell,
        [payload.pair]: [...ordersByPair, { ...payload, selected: true }],
      },
    };
  },
  [coreTypes.REMOVE_SELL_ITEM]: (
    state,
    { payload }: ReturnType<typeof coreActions.removeSellItem>,
  ) => {
    const ordersByPair = state.sell?.[payload.pair];

    const nextOrdersByPair = ordersByPair
      ? {
          [payload.pair]: ordersByPair.filter(
            ({ mint }) => mint !== payload.mint,
          ),
        }
      : {};

    return {
      ...state,
      sell: { ...state.sell, ...nextOrdersByPair },
    };
  },
});
