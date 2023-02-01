import { Tokens } from '../types';

export enum LoadingStatus {
  loading = 'loading',
  success = 'success',
  error = 'error',
}

export enum FetchingStatus {
  fetching = 'fetching',
  idle = 'idle',
  paused = 'paused',
}

export interface AllStats {
  volume24h: number;
  volumeAll: number;
  solanaTPS: number;
  solanaPrice: number;
}

export interface TVLandVolumeStats {
  TVL: string;
  volume: string;
}

export interface TopMarket {
  collectionPublicKey: string;
  collectionImage: string;
  collectionName: string;
  volume24: number;
}

export interface TokenInfo {
  chainId: number;
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI: string;
  tags: string[];
}

export interface TokenRateData {
  id: string;
  mintSymbol: Tokens.SOL;
  price: number;
  vsToken: Tokens;
  vsTokenSymbol: string;
}
