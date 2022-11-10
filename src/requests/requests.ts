import { web3 } from 'hadeswap-sdk';
import { Pair, MarketInfo, Nft } from '../state/core/types';

export const fetchAllMarkets = async (): Promise<MarketInfo[]> => {
  const response = await fetch(`https://${process.env.BACKEND_DOMAIN}/markets`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const fetchMarket = async (
  marketPubkey: string,
): Promise<MarketInfo> => {
  const response = await fetch(
    `https://${process.env.BACKEND_DOMAIN}/markets/${marketPubkey}`,
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

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

export const fetchPair = async (poolPubKey: string): Promise<Pair> => {
  const response = await fetch(
    `https://${process.env.BACKEND_DOMAIN}/pair/${poolPubKey}`,
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

export const fetchMarketWalletNfts = async ({
  marketPubkey,
  walletPubkey,
}: {
  marketPubkey: string;
  walletPubkey: string;
}): Promise<Nft[]> => {
  const response = await fetch(
    `https://${process.env.BACKEND_DOMAIN}/nfts/${walletPubkey}/${marketPubkey}`,
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};
