import { createCustomAction } from 'typesafe-actions';
import { CartOrder, OrderType, Pair } from '../types';

export const cartTypes = {
  ADD_ORDER_TO_CART: 'cart/ADD_ORDER',
  REMOVE_ORDER_FROM_CART: 'cart/REMOVE_ORDER',
  ADD_FINISHED_ORDER_MINT: 'cart/ADD_FINISHED_ORDER_MINT',
};

export const cartActions = {
  addOrderToCart: createCustomAction(
    cartTypes.ADD_ORDER_TO_CART,
    (pair: Pair, order: CartOrder, orderType: OrderType) => ({
      payload: { pair, order, orderType },
    }),
  ),
  removeOrderFromCart: createCustomAction(
    cartTypes.REMOVE_ORDER_FROM_CART,
    (mint: string) => ({
      payload: { mint },
    }),
  ),
  addFinishedOrderMint: createCustomAction(
    cartTypes.ADD_FINISHED_ORDER_MINT,
    (mint: string) => ({
      payload: { mint },
    }),
  ),
};
