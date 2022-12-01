import { createCustomAction } from 'typesafe-actions';
import { CartOrder, OrderType, Pair, PairUpdate } from '../types';

export const cartTypes = {
  UPDATE_PAIRS: 'cart/UPDATE_PAIRS',
  ADD_ORDER_TO_CART: 'cart/ADD_ORDER',
  REMOVE_ORDER_FROM_CART: 'cart/REMOVE_ORDER',
  ADD_FINISHED_ORDER_MINT: 'cart/ADD_FINISHED_ORDER_MINT',
  CLEAR_INVALID_ORDERS: 'cart/CLEAR_INVALID_ORDERS',
  CLEAR_CART: 'cart/CLEAR_CART',
  REPLACE_BUY_ORDER: 'cart/REPLACE_BUY_ORDER',
};

export const cartActions = {
  updatePairs: createCustomAction(
    cartTypes.UPDATE_PAIRS,
    (pairsUpdates: PairUpdate[]) => ({
      payload: pairsUpdates,
    }),
  ),

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
  clearInvalidOrders: createCustomAction(cartTypes.CLEAR_INVALID_ORDERS),
  clearCart: createCustomAction(cartTypes.CLEAR_CART),
  replaceBuyOrder: createCustomAction(
    cartTypes.REPLACE_BUY_ORDER,
    (pairPublicKey: string, prevOrderMint: string, nextOrder: CartOrder) => ({
      payload: { pairPublicKey, prevOrderMint, nextOrder },
    }),
  ),
};
