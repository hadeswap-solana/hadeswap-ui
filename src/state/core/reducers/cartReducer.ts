import { createReducer } from 'typesafe-actions';
import { Dictionary } from 'lodash';
import { coreActions, coreTypes } from '../actions';
import { SellOrder, BuyOrder } from '../actions/cartActions';

type CartState = {
  buy: Dictionary<SellOrder[]>;
  sellToToken: BuyOrder[];
  sellToLiquidity: BuyOrder[];
};

const initialCartState: CartState = {
  buy: {},
  sellToToken: [],
  sellToLiquidity: [],
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

  [coreTypes.ADD_SELL_TO_TOKEN_ITEM]: (
    state,
    { payload }: ReturnType<typeof coreActions.addSellToTokenItem>,
  ) => ({
    ...state,
    sellToToken: [...state.sellToToken, payload],
  }),
  [coreTypes.ADD_SELL_TO_LIQUIDITY_ITEM]: (
    state,
    { payload }: ReturnType<typeof coreActions.addSellToLiquidityItem>,
  ) => ({
    ...state,
    sellToLiquidity: [...state.sellToLiquidity, payload],
  }),
});
