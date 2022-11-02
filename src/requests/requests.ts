import { web3 } from 'hadeswap-sdk';
import { Pair, MarketInfo } from '../state/core/types';

export const fetchWalletPairs = async (
  walletPubkey: web3.PublicKey,
): Promise<Pair[]> => {
  const response = await fetch(
    `https://${process.env.BACKEND_DOMAIN}/my-pairs/${walletPubkey.toBase58()}`,
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
