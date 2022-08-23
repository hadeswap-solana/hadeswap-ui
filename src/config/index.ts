export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

export const ENDPOINT = IS_DEVELOPMENT
  ? process.env.DEVELOPMENT_RPC_ENDPOINT
  : process.env.RPC_ENDPOINT;
