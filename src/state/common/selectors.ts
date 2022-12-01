import { createSelector } from 'reselect';
import { Socket } from 'socket.io-client';
import { identity, pathOr } from 'ramda';
import moment from 'moment';
import { ScreenTypes } from './types';

export const selectSolanaHealth = createSelector(
  [pathOr(null, ['common', 'solanaHealth', 'data'])],
  identity,
);

export const selectSolanaTimestamp = createSelector(
  [pathOr(moment().unix(), ['common', 'fetchSolanaTimestamp', 'data'])],
  identity,
);

export const selectNotification = createSelector(
  [pathOr(null, ['common', 'notification'])],
  identity,
);

export const selectWalletModalVisible = createSelector(
  [pathOr(false, ['common', 'walletModal', 'isVisible'])],
  identity,
);

export const selectConnection = createSelector(
  [pathOr(null, ['common', 'connection', 'connection'])],
  identity,
);

export const selectSocket = createSelector(
  [pathOr(null, ['common', 'socket', 'socket'])],
  (socket: Socket) => socket,
);

export const selectWallet = createSelector(
  [pathOr({}, ['common', 'wallet', 'wallet'])],
  identity,
);

export const selectWalletPublicKey = createSelector(
  [pathOr(null, ['common', 'wallet', 'wallet', 'publicKey'])],
  identity,
);

export const selectUser = createSelector(
  [pathOr(null, ['common', 'user', 'data'])],
  identity,
);

export const selectModalVisible = createSelector(
  [pathOr(false, ['common', 'discordModal', 'isVisible'])],
  identity,
);

export const selectConfettiVisible = createSelector(
  [pathOr(false, ['common', 'confetti', 'isVisible'])],
  identity,
);

export const selectCartSiderVisible = createSelector(
  [pathOr(false, ['common', 'cartSider', 'isVisible'])],
  identity,
);

export const selectExchangeModalVisible = createSelector(
  [pathOr(false, ['common', 'exchangeModal', 'isVisible'])],
  identity,
);

export const selectScreeMode = createSelector(
  (store: any) => store?.common?.screenMode as ScreenTypes,
  (screenType: ScreenTypes) => screenType,
);
