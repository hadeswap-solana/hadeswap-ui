import * as Sentry from '@sentry/react';
import { WalletContextState } from '@solana/wallet-adapter-react';

export const initSentry = (): void => {
  Sentry.init({
    dsn: 'https://1828f52fa41e4cd8b03eef035be5f220@o1431968.ingest.sentry.io/4503897232900096',
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

  console.error(error);
  if (error?.logs) {
    // eslint-disable-next-line no-console
    console.warn('Transaction logs: ', error?.logs?.join('\n'));
  }
};
