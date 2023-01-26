import { web3 } from 'hadeswap-sdk';
import { Pair, MarketInfo, Nft, NftActivityData } from '../state/core/types';
import { AllStats, TVLandVolumeStats, TopMarket } from './types';

export const fetchAllMarkets = async (): Promise<MarketInfo[]> => {
  const response = await fetch(`https://${process.env.BACKEND_DOMAIN}/markets`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const fetchMarket = async (publicKey: string): Promise<MarketInfo> => {
  const response = await fetch(
    `https://${process.env.BACKEND_DOMAIN}/markets/${publicKey}`,
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

export const fetchMarketWalletNfts = async ({
  walletPubkey,
  marketPubkey,
}: {
  walletPubkey: string;
  marketPubkey: string;
}): Promise<Nft[]> => {
  const response = await fetch(
    `https://${process.env.BACKEND_DOMAIN}/nfts/${walletPubkey}/${marketPubkey}`,
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const nfts = await response.json();

  return nfts.map((nft) => ({
    ...nft,
    validProof: nft?.validProof?.map(
      (buffer: { type: 'Buffer'; data: Array<number> }) =>
        Buffer.from(buffer.data),
    ),
  }));
};

export const fetchAllStats = async (): Promise<AllStats> => {
  const response = await fetch(`https://${process.env.BACKEND_DOMAIN}/stats`);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const fetchTVLandVolumeStats = async (): Promise<TVLandVolumeStats> => {
  const response = await fetch(
    `https://${process.env.BACKEND_DOMAIN}/stats/all?$volumePeriod=all`,
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const fetchTopMarkets = async (): Promise<TopMarket[]> => {
  const response = await fetch(
    `https://${process.env.BACKEND_DOMAIN}/stats/markets/volume24h`,
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const fetchSwapHistoryPool = async (
  publicKey: string,
): Promise<NftActivityData[]> => {
  const response = await fetch(
    `https://${process.env.BACKEND_DOMAIN}/trades/pair/${publicKey}`,
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const fetchSwapHistoryCollection = async (
  publicKey: string,
): Promise<any> => {
  const LIMIT = 10000;

  const response = await fetch(
    `https://api.hadeswap.com/trades/${publicKey}?sortBy=timestamp&sort=asc&limit=${LIMIT}&skip=0`,
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};
