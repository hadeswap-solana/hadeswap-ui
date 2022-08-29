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
    const ordersByPair = state.buy?.[payload.pair];

    const nextOrdersByPair = ordersByPair
      ? {
          [payload.pair]: ordersByPair.filter(
            ({ mint }) => mint !== payload.mint,
          ),
        }
      : {};

    return {
      ...state,
      buy: { ...state.buy, ...nextOrdersByPair },
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
