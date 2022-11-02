import { web3 } from 'hadeswap-sdk';
import { Pair, MarketInfo } from '../state/core/types';

export const fetchWalletPairs =
  (walletPubkey: web3.PublicKey): (() => Promise<Pair[]>) =>
  async (): Promise<Pair[]> => {
    const response = await fetch(
      `https://${
        process.env.BACKEND_DOMAIN
      }/my-pairs/${walletPubkey.toBase58()}`,
    );
    return await response.json();
  };

export const fetchAllMarkets = async (): Promise<MarketInfo[]> => {
  const response = await fetch(`https://${process.env.BACKEND_DOMAIN}/markets`);
  return await response.json();
};
