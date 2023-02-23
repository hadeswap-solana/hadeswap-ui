import { TokensValues } from '../../types';
import { TokenInfo, TokenRateData } from '../types';
import { TOKEN_LIST_URL } from '@jup-ag/core';

export const fetchTokensRate = async ({
  tokenValue,
}: {
  tokenValue: TokensValues;
}): Promise<TokenRateData> => {
  const response = await fetch(
    `https://quote-api.jup.ag/v4/price?ids=SOL&vsToken=${tokenValue}`,
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const {
    data: { SOL },
  } = await response.json();
  return SOL;
};

export const fetchTokensInfo = async (): Promise<TokenInfo[]> => {
  const ENV =
    process.env.SOLANA_NETWORK === 'devnet' ? 'devnet' : 'mainnet-beta';

  const response = await fetch(TOKEN_LIST_URL[ENV]);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return await response.json();
};
