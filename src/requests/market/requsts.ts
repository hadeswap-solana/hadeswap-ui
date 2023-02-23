import { MarketInfo } from '../../state/core/types';

export const fetchMarket = async (publicKey: string): Promise<MarketInfo> => {
  const response = await fetch(
    `https://${process.env.BACKEND_DOMAIN}/markets/${publicKey}`,
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const fetchAllMarkets = async (): Promise<MarketInfo[]> => {
  const response = await fetch(`https://${process.env.BACKEND_DOMAIN}/markets`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};
