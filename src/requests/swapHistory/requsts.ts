import { ActivityPeriod } from '../../components/Chart/components/constants';
import { NftActivityData } from '../../state/core/types';

export const fetchSwapHistoryPool = async (
  publicKey: string,
  period: ActivityPeriod,
): Promise<NftActivityData[]> => {
  const response = await fetch(
    `https://${process.env.BACKEND_DOMAIN}/trades/pair/${publicKey}/chart?period=${period}`,
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const fetchSwapHistoryCollection = async (
  marketPublicKey: string,
  period: ActivityPeriod,
): Promise<NftActivityData[]> => {
  const response = await fetch(
    `https://${process.env.BACKEND_DOMAIN}/trades/market/${marketPublicKey}/chart?period=${period}`,
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};
