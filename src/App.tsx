//? Line for service (CI/CD) commits 1
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  BackpackWalletAdapter,
  CoinbaseWalletAdapter,
  GlowWalletAdapter,
  LedgerWalletAdapter,
  MathWalletAdapter,
  NightlyWalletAdapter,
  PhantomWalletAdapter,
  SafePalWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletWalletAdapter,
  StrikeWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { FC, useEffect, useState } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Router } from './router';
import store from './state/store';
import { getRightEndpoint } from './config';
import Confetti from './components/Confetti';
import { initSentry } from './utils/sentry';
import { Jupiter } from './components/Jupiter';

const queryClient = new QueryClient();
initSentry();

const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
  new SlopeWalletAdapter(),
  new GlowWalletAdapter(),
  new LedgerWalletAdapter(),
  new CoinbaseWalletAdapter(),
  new TorusWalletAdapter(),
  new MathWalletAdapter(),
  new BackpackWalletAdapter(),
  new StrikeWalletAdapter(),
  new SafePalWalletAdapter(),
  new NightlyWalletAdapter(),
  new SolletWalletAdapter({ network: WalletAdapterNetwork.Mainnet }),
];

const App: FC = () => {
  const [endpoint, setEndpoint] = useState<string>(null);

  useEffect(() => {
    (async () => {
      const endpoint = await getRightEndpoint();
      setEndpoint(endpoint);
    })();
  }, []);

  if (!endpoint) return <></>;

  return (
    <QueryClientProvider client={queryClient}>
      <ReduxProvider store={store}>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <Jupiter>
              <Router />
              <Confetti />
            </Jupiter>
          </WalletProvider>
        </ConnectionProvider>
      </ReduxProvider>
    </QueryClientProvider>
  );
};

export default App;
