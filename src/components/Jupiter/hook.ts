import { useEffect, useState, useMemo } from 'react';
import { useJupiter } from '@jup-ag/react-hook';
import { PublicKey } from '@solana/web3.js';
import { useTokenInfo, useTokenRate } from '../../requests/exchangeToken';
import JSBI from 'jsbi';
import { Tokens } from '../../types';
import { TokenInfo } from '../../requests/types';

interface ExchangeTokensProps {
  rawSolAmount: number;
  inputToken: Tokens;
}

const calcAmount = (rawSolAmount = 1, decimals = 1, rate = 1): JSBI => {
  const inputAmount = (rawSolAmount / 1e9) * rate;
  const rawAmount = Math.ceil(inputAmount * 10 ** decimals);
  return JSBI.BigInt(rawAmount);
};

export const useExchangeData = ({
  rawSolAmount,
  inputToken,
}: ExchangeTokensProps): {
  jupiter: any;
  isLoading: boolean;
  isFetching: boolean;
} => {
  const [inputTokenInfo, setInputTokenInfo] = useState<TokenInfo>();

  const inputMint = useMemo(() => new PublicKey(inputToken), [inputToken]);
  const outputMint = useMemo(() => new PublicKey(Tokens.SOL), []);

  const { tokensData, tokensLoading, tokensFetching } = useTokenInfo();
  const { tokenRate, rateLoading, rateFetching } = useTokenRate({ inputToken });

  useEffect(() => {
    tokensData &&
      setInputTokenInfo(tokensData.find((item) => item.address === inputToken));
  }, [tokensData, inputToken]);

  const amount: JSBI = useMemo(
    () => calcAmount(rawSolAmount, inputTokenInfo?.decimals, tokenRate?.price),
    [rawSolAmount, inputTokenInfo, tokenRate],
  );

  const jupiter = useJupiter({
    amount,
    inputMint,
    outputMint,
    slippageBps: 100,
    debounceTime: 250,
  });

  return {
    jupiter,
    isLoading: rateLoading || tokensLoading,
    isFetching: rateFetching || tokensFetching,
  };
};
