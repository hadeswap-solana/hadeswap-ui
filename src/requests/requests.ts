import { web3 } from 'hadeswap-sdk';

export const fetchWalletPairs =
  (walletPubkey: web3.PublicKey) => async (): Promise<void> => {
    const response = await fetch(
      `https://${
        process.env.BACKEND_DOMAIN
      }/my-pairs/${walletPubkey.toBase58()}`,
    );
    return await response.json();
  };

export const fetchAllMarkets = async (): Promise<void> => {
  const response = await fetch(`https://${process.env.BACKEND_DOMAIN}/markets`);
  return await response.json();
};
