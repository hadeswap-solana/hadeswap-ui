import * as Sentry from '@sentry/react';
import { WalletContextState } from '@solana/wallet-adapter-react';

export const initSentry = (): void => {
  Sentry.init({
    dsn: 'https://9cd7c9f95ba944a39d84ee8098afff9d@o1288412.ingest.sentry.io/6782896',
    // ignoreErrors: [
    //   'Registration failed - push service error',
    //   'We are unable to register the default service worker',
    //   'The notification permission was not granted and blocked instead',
    //   'The string did not match the expected pattern',
    // ],
    tracesSampleRate: 1.0,
  });
};

export const captureSentryError = ({
  error,
  wallet,
  transactionName = '',
  params,
}: {
  error: any;
  wallet?: WalletContextState;
  transactionName?: string;
  params?: any;
}): void => {
  const user = wallet?.publicKey?.toBase58();

  if (process.env.SOLANA_NETWORK !== 'devnet') {
    if (user) {
      Sentry.setUser({ user });
    } else {
      Sentry.setUser(null);
    }

    Sentry.setTag('Transaction name', transactionName);
    Sentry.setContext('Params', params);
    Sentry.setExtra('Transaction logs: ', error?.logs?.join('\n'));
    Sentry.configureScope((scope) => scope.setTransactionName(transactionName));
    Sentry.captureException(error);
  }

  console.error(error);
  if (error?.logs) {
    // eslint-disable-next-line no-console
    console.warn('Transaction logs: ', error?.logs?.join('\n'));
  }
};
