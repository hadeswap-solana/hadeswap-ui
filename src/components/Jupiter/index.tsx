import { FC, ReactNode } from 'react';
import { JupiterProvider } from '@jup-ag/react-hook';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

interface ExchangeTokenProps {
  children?: ReactNode;
}

export const Jupiter: FC<ExchangeTokenProps> = ({ children }) => {
  const { connection } = useConnection();
  const wallet = useWallet();

  return (
    <JupiterProvider
      connection={connection}
      userPublicKey={wallet.publicKey || undefined}
    >
      {children}
    </JupiterProvider>
  );
};
