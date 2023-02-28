import { AllStats, TVLandVolumeStats, TopMarket } from './types';

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
