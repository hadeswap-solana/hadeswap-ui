import { useMemo } from 'react';
import { useJupiter } from '@jup-ag/react-hook';
import { PublicKey } from '@solana/web3.js';
import { TokensValues } from '../../types';
import { TokenItem } from '../../constants/tokens';
import JSBI from 'jsbi';

type UseJupiterData = (params: { amount: JSBI; inputToken: TokenItem }) => {
  jupiter: any;
};

export const useJupiterData: UseJupiterData = ({ amount, inputToken }) => {
  const inputMint = useMemo(
    () => new PublicKey(inputToken.value),
    [inputToken.value],
  );
  const outputMint = useMemo(() => new PublicKey(TokensValues.SOL), []);

  const jupiter = useJupiter({
    amount,
    inputMint,
    outputMint,
    slippageBps: 100,
    debounceTime: 250,
  });

  return {
    jupiter,
  };
};
