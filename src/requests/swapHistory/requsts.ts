import { NftActivityData } from '../../state/core/types';

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
