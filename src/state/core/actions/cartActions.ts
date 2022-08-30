import { createCustomAction } from 'typesafe-actions';
import { CartOrder, OrderType, Pair } from '../types';

export const cartTypes = {
  ADD_ORDER: 'core/ADD_ORDER',
  REMOVE_ORDER: 'core/REMOVE_ORDER',
};

export const cartActions = {
  addOrder: createCustomAction(
    cartTypes.ADD_ORDER,
    (pair: Pair, order: CartOrder, orderType: OrderType) => ({
      payload: { pair, order, orderType },
    }),
  ),
  removeOrder: createCustomAction(cartTypes.REMOVE_ORDER, (mint: string) => ({
    payload: { mint },
  })),
};
