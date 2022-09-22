import { identity } from 'ramda';
import { createSelector } from 'reselect';
import { CartPair, CartOrder, OrderType } from '../types';
import { Dictionary } from 'lodash';
import { CartState } from '../reducers/cartReducer';

export const selectCartState = createSelector(
  (store: any) => (store?.core?.cart as CartState) || {},
  identity<CartState>,
);

export const selectCartPairs = createSelector(
  selectCartState,
  (cart: CartState) => (cart?.pairs as Dictionary<CartPair>) || {},
);

export const selectCartFinishedOrdersMints = createSelector(
  selectCartState,
  (cart: CartState) => (cart?.finishedOrdersMints as string[]) || [],
);

export const selectCartPendingOrders = createSelector(
  selectCartState,
  (cart: CartState) => {
    const { pendingOrders, finishedOrdersMints } = cart;
    const filteredPendingOrders = Object.fromEntries(
      Object.entries(pendingOrders).map(([pairPubkey, orders]) => [
        pairPubkey,
        orders.filter(({ mint }) => !finishedOrdersMints.includes(mint)),
      ]),
    );

    return (filteredPendingOrders as Dictionary<CartOrder[]>) || {};
  },
);

export const selectCartItems = createSelector(
  selectCartPendingOrders,
  (pendingOrders): { buy: CartOrder[]; sell: CartOrder[] } => {
    const allOrders = Object.values(pendingOrders).flat();
    return {
      buy: allOrders
        .filter(({ type }) => type === OrderType.BUY)
        .sort((a: CartOrder, b: CartOrder) => a.price - b.price) as CartOrder[],
      sell: allOrders.filter(({ type }) => type === OrderType.SELL),
    };
  },
);

export const selectCartPairsPubkeys = createSelector(
  selectCartPairs,
  (pairsMap): string[] =>
    Object.entries(pairsMap)
      .filter(([, value]) => !!value)
      .map(([key]) => key),
);

export const selectAllInvalidCartOrders = createSelector(
  selectCartState,
  (cartState): CartOrder[] =>
    Object.values(cartState.invalidOrders)
      .flat()
      .filter(({ mint }) => !cartState?.finishedOrdersMints?.includes(mint)),
);

export const selectCartPendingOrdersAmount = createSelector(
  selectCartPendingOrders,
  (pendingOrders) => Object.values(pendingOrders).flat().length || 0,
);

export const selectIsCartEmpty = createSelector(
  selectCartPendingOrdersAmount,
  (pendingOrdersAmount) => pendingOrdersAmount === 0,
);
