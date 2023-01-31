import { Jupiter } from '@jup-ag/core';
import { PublicKey } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'hadeswap-sdk';
import JSBI from 'jsbi';
import { ENV, getTokens, getRate } from './requsts';
import { Tokens } from '../../types';
import { Token } from '../../requests/types';

interface RatesResponse {
  SOL: {
    id: string;
    mintSymbol: Tokens.SOL;
    price: number;
    vsToken: Tokens;
    vsTokenSymbol: string;
  };
}

interface ExchangeTokensProps {
  solAmount: number;
  inputToken: Tokens;
  wallet: WalletContextState;
  connection: web3.Connection;
}

export const exchangeTokens = async ({ solAmount = 1, inputToken, wallet, connection }: ExchangeTokensProps) => {
  console.log('solAmount', solAmount);

  const inputMint = new PublicKey(inputToken);
  const outputMint = new PublicKey(Tokens.SOL);

  const tokensData: Token[] = await getTokens();
  const inputTokenInfo: Token = tokensData.find(item => item.address === inputToken);
  console.log('inputTokenInfo', inputTokenInfo);

  const { data: { SOL } }: { data: RatesResponse } = await getRate({ inputToken });
  console.log('rate', SOL);
  const rawInputAmount = SOL.price * solAmount;
  console.log('rawInputAmount', rawInputAmount);

  const amount: JSBI = JSBI.BigInt(Math.ceil(rawInputAmount) * (10 ** inputTokenInfo?.decimals || 1));
  console.log('amount', amount);

  const jupiter = await Jupiter.load({
    connection,
    cluster: ENV,
    user: wallet.publicKey,
  });

  console.log('jupiter', jupiter);

  const routes = await jupiter.computeRoutes({
    inputMint,
    outputMint,
    amount,
    slippageBps: 1,
    forceFetch: false,
  });

  console.log('routes', routes);

  const { execute } = await jupiter.exchange({
    routeInfo: routes.routesInfos[0],
  });

  return await execute();
};
