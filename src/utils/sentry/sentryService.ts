import * as Sentry from '@sentry/react';
import { WalletContextState } from '@solana/wallet-adapter-react';

export const initSentry = (): void => {
  Sentry.init({
    dsn: process.env.SENTRY_APP_DSN,
    ignoreErrors: [
      'Registration failed - push service error',
      'We are unable to register the default service worker',
      'The notification permission was not granted and blocked instead',
      'The string did not match the expected pattern',
      'WalletSignTransactionError: User rejected the request.',
    ],
    defaultIntegrations: false,
    tracesSampleRate: 1.0,
  });

  Sentry.Integrations.InboundFilters;
};

export const captureSentryError = ({
  error,
  wallet,
  transactionName = 'Transaction error',
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
      Sentry.setUser({ id: user });
    } else {
      Sentry.setUser(null);
    }

    Sentry.setTag('Transaction name', transactionName);
    Sentry.setContext('Params', params);
    Sentry.setExtra('Transaction logs: ', error?.logs?.join('\n'));
    Sentry.configureScope((scope) => scope.setTransactionName(transactionName));
    Sentry.captureException(error);
  }

  if (error?.logs) {
    // eslint-disable-next-line no-console
    console.warn('Transaction logs: ', error?.logs?.join('\n'));
  }
};
