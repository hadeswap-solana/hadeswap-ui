import { coreTypes, coreActions } from './actions';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { selectSocket } from '../common/selectors';
import { Socket } from 'socket.io-client';
import { eventChannel } from 'redux-saga';
import {
  selectCartPairsPubkeys,
  selectCartPendingOrdersAmount,
} from './selectors';
import { commonActions } from '../common/actions';

const updateCartSaga = function* (
  action:
    | ReturnType<typeof coreActions.addOrderToCart>
    | ReturnType<typeof coreActions.removeOrderFromCart>,
) {
  const pendingOrdersAmount = yield select(selectCartPendingOrdersAmount);

  //? Auto show cart if first order added
  if (
    pendingOrdersAmount === 1 &&
    action.type === coreTypes.ADD_ORDER_TO_CART
  ) {
    yield put(commonActions.setCartSider({ isVisible: true }));
  }
  //? Auto hide cart if last order removed
  if (
    pendingOrdersAmount === 0 &&
    action.type === coreTypes.REMOVE_ORDER_FROM_CART
  ) {
    yield put(commonActions.setCartSider({ isVisible: false }));
  }

  const socket = yield select(selectSocket);
  const pairsPubkeys = yield select(selectCartPairsPubkeys);

  if (pairsPubkeys && socket) {
    socket.emit('pairs-subscribe', pairsPubkeys);
  }
};

const cartPairsChannel = (socket: Socket) =>
  eventChannel((emit) => {
    socket.on('pairs', (response) => emit(response));
    return () => socket.off('pairs');
  });

const subscribeCartPairsSaga = function* (pairs) {
  yield put(coreActions.updatePairs(pairs));
};

const coreSocketSagas = (socket: Socket) =>
  function* (): Generator {
    const cartPairsStream: any = yield call(cartPairsChannel, socket);
    yield all([takeLatest(cartPairsStream, subscribeCartPairsSaga)]);
    yield all([
      takeLatest(
        [coreTypes.ADD_ORDER_TO_CART, coreTypes.REMOVE_ORDER_FROM_CART],
        updateCartSaga,
      ),
    ]);
  };

export default coreSocketSagas;
