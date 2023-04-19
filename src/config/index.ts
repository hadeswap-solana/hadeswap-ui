import { Connection } from '@solana/web3.js';

export const ENDPOINT = process.env.RPC_ENDPOINT;

export const getRightEndpoint = async () => {
  try {
    const primaryConnection = new Connection(
      process.env.ADBLOCKED_RPC_ENDPOINT,
    );
    await primaryConnection.getLatestBlockhash();
    return process.env.ADBLOCKED_RPC_ENDPOINT;
  } catch (err) {
    console.error('Helius RPC doesnt work, use secondary RPC instead');
    try {
      const secondaryConnection = new Connection(process.env.RPC_ENDPOINT);
      await secondaryConnection.getLatestBlockhash();
      return process.env.RPC_ENDPOINT;
    } catch (err) {
      console.error('Quicknode RPC doesnt work, use public RPC instead');
      return process.env.PUBLIC_RPC_ENDPOINT;
    }
  }
};
