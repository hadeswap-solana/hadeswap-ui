import { Pair } from '../../state/core/types';

export const fetchPair = async (poolPubkey: string): Promise<Pair> => {
  const response = await fetch(
    `https://${process.env.BACKEND_DOMAIN}/pair/${poolPubkey}`,
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const fetchMarketPairs = async (
  marketPubkey: string,
): Promise<Pair[]> => {
  const response = await fetch(
    `https://${process.env.BACKEND_DOMAIN}/pairs/${marketPubkey}`,
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};
