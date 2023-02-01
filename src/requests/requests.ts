import { web3 } from 'hadeswap-sdk';
import { TOKEN_LIST_URL } from '@jup-ag/core';
import { Pair, MarketInfo, Nft, NftActivityData } from '../state/core/types';
import {
  AllStats,
  TVLandVolumeStats,
  TopMarket,
  TokenInfo,
  TokenRateData,
} from './types';
import { Tokens } from '../types';

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

export const fetchTokensInfo = async (): Promise<TokenInfo[]> => {
  const ENV =
    process.env.SOLANA_NETWORK === 'devnet' ? 'devnet' : 'mainnet-beta';

  const response = await fetch(TOKEN_LIST_URL[ENV]);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return await response.json();
};

export const fetchTokensRate = async ({
  inputToken,
}: {
  inputToken: Tokens;
}): Promise<TokenRateData> => {
  const response = await fetch(
    `https://quote-api.jup.ag/v4/price?ids=SOL&vsToken=${inputToken}`,
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const {
    data: { SOL },
  } = await response.json();
  return SOL;
};

export const fetchSwapHistoryCollection = async (
  marketPublicKey: string,
): Promise<NftActivityData[]> => {
  const LIMIT = 10000;

  const response = await fetch(
    `https://${process.env.BACKEND_DOMAIN}/trades/${marketPublicKey}?sortBy=timestamp&sort=asc&limit=${LIMIT}&skip=0`,
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
