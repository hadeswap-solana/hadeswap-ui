import { createReducer } from 'typesafe-actions';
import { Dictionary } from 'lodash';
import { coreActions, coreTypes } from '../actions';
import { SellOrder, BuyOrder } from '../actions/cartActions';

export type CartState = {
  buy: Dictionary<SellOrder[]>; //? Dictionary by pairPubkey
  sell: Dictionary<BuyOrder[]>; //? Dictionary by marketPubkey
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
    const ordersByMarket = state.sell?.[payload.market] || [];
    return {
      ...state,
      sell: {
        ...state.sell,
        [payload.market]: [...ordersByMarket, { ...payload, selected: true }],
      },
    };
  },
  [coreTypes.REMOVE_SELL_ITEM]: (
    state,
    { payload }: ReturnType<typeof coreActions.removeSellItem>,
  ) => {
    const marketOrders = state.sell?.[payload.market];

    const removableItem = marketOrders.find(
      ({ mint }) => mint === payload.mint,
    );

    const isLastIndex =
      marketOrders.map(({ mint }) => mint).indexOf(payload.mint) ===
      marketOrders.length;

    const filteredOrders = marketOrders.filter(
      ({ mint }) => mint !== payload.mint,
    );

    if (filteredOrders.length && !isLastIndex) {
      const lastItem = filteredOrders.pop();
      filteredOrders.push({
        ...removableItem,
        mint: lastItem.mint,
        imageUrl: lastItem.imageUrl,
        name: lastItem.name,
        traits: lastItem.traits,
        collectionName: lastItem.collectionName,
      } as BuyOrder);
    }

    return {
      ...state,
      sell: {
        ...state.sell,
        [payload.market]: filteredOrders,
      },
    };
  },
});
