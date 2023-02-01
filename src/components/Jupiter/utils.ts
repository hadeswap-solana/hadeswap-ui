import { WalletContextState } from '@solana/wallet-adapter-react';

export const exchangeToken = async ({
  jupiter,
  wallet,
}: {
  jupiter: any;
  wallet: WalletContextState;
}): Promise<void> => {
  const bestRoute = jupiter.routes[0];

  await jupiter.exchange({
    wallet: {
      sendTransaction: wallet.sendTransaction,
      publicKey: wallet.publicKey,
      signAllTransactions: wallet.signAllTransactions,
      signTransaction: wallet.signTransaction,
    },
    routeInfo: bestRoute,
  });
};
