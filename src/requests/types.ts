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
