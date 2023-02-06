import { WalletContextState } from '@solana/wallet-adapter-react';
import { BN } from 'hadeswap-sdk';

interface ExchangeResult {
  error?: {
    code: number;
    message: string;
  };
  name?: string;
  message?: string;
  stack?: string;
  inputAddress?: BN;
  inputAmount?: number;
  outputAddress?: BN;
  outputAmount?: number;
  txid?: string;
}

export const exchangeToken = async ({
  jupiter,
  wallet,
}: {
  jupiter: any;
  wallet: WalletContextState;
}): Promise<ExchangeResult> => {
  const bestRoute = jupiter.routes[0];

  return await jupiter.exchange({
    wallet: {
      sendTransaction: wallet.sendTransaction,
      publicKey: wallet.publicKey,
      signAllTransactions: wallet.signAllTransactions,
      signTransaction: wallet.signTransaction,
    },
    routeInfo: bestRoute,
  });
};
