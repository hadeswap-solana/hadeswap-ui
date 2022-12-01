// import { AsyncState } from './../../utils/state/types';
import { commonActions, commonTypes } from './actions';
import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';

import { composeReducers } from '../../utils/state';
import {
  CartSiderState,
  ConfettiState,
  ConnectionState,
  ModalState,
  ScreenTypes,
  SocketState,
  WalletState,
} from './types';

// export const initialSolanaHealthState: AsyncState<SolanaHealthState> =
//   createInitialAsyncState<SolanaHealthState>({
//     health: SolanaNetworkHealth.Good,
//     loss: 0,
//   });
// export const initialFetchSolanaTimestampState: AsyncState<number> =
//   createInitialAsyncState<number>(null);
export const initialConnectionState: ConnectionState = { connection: null };
export const initialSocketState: SocketState = { socket: null };
export const initialWalletState: WalletState = {
  wallet: {
    publicKey: null,
  },
};
// export const initialUserState: AsyncState<UserState> =
//   createInitialAsyncState<UserState>(null);

// export const initialNotificationState: NotificationState = {
//   isVisible: false,
//   config: null,
// };
export const initialModalState: ModalState = { isVisible: false };
export const initialConfettiState: ModalState = { isVisible: false };

export const initialCartSiderState: CartSiderState = { isVisible: false };
const initialScreenMode: ScreenTypes = ScreenTypes.DESKTOP;
// const solanaHealthReducer = createReducer(
//   initialSolanaHealthState,
//   createHandlers<SolanaHealthState>(commonTypes.FETCH_SOLANA_HEALTH),
// );
// const fetchSolanaTimestampReducer = createReducer(
//   initialFetchSolanaTimestampState,
//   createHandlers<number>(commonTypes.FETCH_SOLANA_TIMESTAMP),
// );
const setConnectionReducer = createReducer<ConnectionState>(
  initialConnectionState,
  {
    [commonTypes.SET_CONNECTION]: (
      state,
      action: ReturnType<typeof commonActions.setConnection>,
    ) => ({
      ...state,
      connection: action.payload,
    }),
  },
);
const setSocketReducer = createReducer<SocketState>(initialSocketState, {
  [commonTypes.SET_SOCKET]: (
    state,
    action: ReturnType<typeof commonActions.setSocket>,
  ) => ({
    ...state,
    socket: action.payload,
  }),
});
const setWalletReducer = createReducer<WalletState>(initialWalletState, {
  [commonTypes.SET_WALLET]: (
    state,
    action: ReturnType<typeof commonActions.setWallet>,
  ) => ({
    ...state,
    wallet: action.payload,
  }),
});
// const setNotificationReducer = createReducer<NotificationState>(
//   initialNotificationState,
//   {
//     [commonTypes.SET_NOTIFICATION]: (
//       state,
//       action: ReturnType<typeof commonActions.setNotification>,
//     ) => ({
//       ...state,
//       ...action.payload,
//     }),
//   },
// );
const setWalletModalReducer = createReducer<ModalState>(initialModalState, {
  [commonTypes.SET_WALLET_MODAL]: (
    state,
    action: ReturnType<typeof commonActions.setWalletModal>,
  ) => ({
    ...state,
    ...action.payload,
  }),
});
const toggleWalletModalReducer = createReducer<ModalState>(initialModalState, {
  [commonTypes.TOGGLE_WALLET_MODAL]: (state) => ({
    isVisible: !state.isVisible,
  }),
});
// const fetchUserReducer = createReducer(
//   initialUserState,
//   createHandlers<UserState>(commonTypes.FETCH_USER),
// );
// const toggleDiscordModalReducer = createReducer<ModalState>(initialModalState, {
//   [commonTypes.TOGGLE_DISCORD_MODAL]: (state) => ({
//     isVisible: !state.isVisible,
//   }),
// });

const setConfettiReducer = createReducer<ConfettiState>(initialConfettiState, {
  [commonTypes.SET_CONFETTI]: (state) => ({
    isVisible: !state.isVisible,
  }),
});

const setCartSiderReducer = createReducer<CartSiderState>(
  initialCartSiderState,
  {
    [commonTypes.SET_CART_SIDER]: (
      state,
      action: ReturnType<typeof commonActions.setCartSider>,
    ) => ({
      ...state,
      ...action.payload,
    }),
  },
);

const toggleCartSiderReducer = createReducer<CartSiderState>(
  initialCartSiderState,
  {
    [commonTypes.TOGGLE_CART_SIDER]: (state) => ({
      isVisible: !state.isVisible,
    }),
  },
);

const setScreenModeReducer = createReducer<ScreenTypes>(initialScreenMode, {
  [commonTypes.SET_SCREEN_MODE]: (__, action) => action.payload,
});

const setExchangeModalReducer = createReducer<ModalState>(initialModalState, {
  [commonTypes.SET_EXCHANGE_MODAL]: (
    state,
    action: ReturnType<typeof commonActions.setExchangeModal>,
  ) => ({
    ...state,
    ...action.payload,
  }),
});

export default combineReducers({
  connection: setConnectionReducer,
  socket: setSocketReducer,
  wallet: setWalletReducer,
  // solanaHealth: solanaHealthReducer,
  // user: fetchUserReducer,
  // fetchSolanaTimestamp: fetchSolanaTimestampReducer,
  // notification: setNotificationReducer,
  walletModal: composeReducers(setWalletModalReducer, toggleWalletModalReducer),
  // discordModal: toggleDiscordModalReducer,
  confetti: setConfettiReducer,
  cartSider: composeReducers(setCartSiderReducer, toggleCartSiderReducer),
  screenMode: setScreenModeReducer,
  exchangeModal: setExchangeModalReducer,
});
