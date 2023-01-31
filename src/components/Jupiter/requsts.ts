import { Token } from '../../requests/types';
import { Tokens } from '../../types';
import { TOKEN_LIST_URL } from '@jup-ag/core';

export const ENV = process.env.SOLANA_NETWORK === 'devnet' ? 'devnet' : 'mainnet-beta';

export const getTokens = async (): Promise<Token[]> => {
  const response = await fetch(TOKEN_LIST_URL[ENV]);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const getRate = async ({ inputToken }: { inputToken: Tokens }) => {
  const response = await fetch(`https://quote-api.jup.ag/v4/price?ids=SOL&vsToken=${inputToken}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};
