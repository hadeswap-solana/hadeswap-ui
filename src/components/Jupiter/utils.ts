import { WalletContextState } from '@solana/wallet-adapter-react';
import { BN } from 'hadeswap-sdk';
import JSBI from 'jsbi';
import { calcTokenAmount } from '../../utils';

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

export const calcAmount = (
  rawSolAmount = 1,
  decimals = 1,
  rate = 1,
): {
  amount: JSBI;
  tokenFormattedAmount: string;
  rate: number;
} => {
  const solAmount: string = (rawSolAmount / 1e9).toFixed(3);
  const inputAmount = calcTokenAmount(solAmount, rate);

  const rawAmount = Math.ceil(Number(inputAmount) * 10 ** decimals);
  return {
    amount: JSBI.BigInt(rawAmount),
    tokenFormattedAmount: inputAmount,
    rate,
  };
};

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
