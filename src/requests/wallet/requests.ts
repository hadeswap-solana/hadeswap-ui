import { Nft, Pair } from '../../state/core/types';
import { WalletAllFees } from '../types';

export const fetchMarketWalletNfts = async ({
  walletPubkey,
  marketPubkey,
}: {
  walletPubkey: string;
  marketPubkey: string;
}): Promise<Nft[]> => {
  const response = await fetch(
    `https://${process.env.BACKEND_DOMAIN}/nfts/${walletPubkey}/${marketPubkey}?isFrozen=false`,
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

export const fetchWalletPairs = async (
  walletPubkey: string,
): Promise<Pair[]> => {
  const response = await fetch(
    `https://${process.env.BACKEND_DOMAIN}/my-pairs/${walletPubkey}`,
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const fetchWalletAllFees = async (
  walletPubkey: string,
): Promise<WalletAllFees> => {
  const response = await fetch(
    `https://${process.env.BACKEND_DOMAIN}/my-earned-fees/${walletPubkey}`,
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};
