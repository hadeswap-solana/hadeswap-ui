//? Line for service (CI/CD) commits 2
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  SlopeWalletAdapter,
  GlowWalletAdapter,
  CoinbaseWalletAdapter,
  TorusWalletAdapter,
  MathWalletAdapter,
  SolletWalletAdapter,
  BackpackWalletAdapter,
  StrikeWalletAdapter,
  NightlyWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { FC } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Router } from './router';
import store from './state/store';
import { ENDPOINT } from './config';
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
  new NightlyWalletAdapter(),
  new SolletWalletAdapter({ network: WalletAdapterNetwork.Mainnet }),
];

const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReduxProvider store={store}>
        <ConnectionProvider endpoint={ENDPOINT}>
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
