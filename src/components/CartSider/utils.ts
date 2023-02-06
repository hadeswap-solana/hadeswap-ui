import JSBI from 'jsbi';

export const calcAmount = (
  rawSolAmount = 1,
  decimals = 1,
  rate = 1,
): {
  amount: JSBI;
  tokenFormattedAmount: string;
  rate: number;
} => {
  const inputAmount = (rawSolAmount / 1e9) * rate;
  const rawAmount = Math.ceil(inputAmount * 10 ** decimals);
  return {
    amount: JSBI.BigInt(rawAmount),
    tokenFormattedAmount: inputAmount.toFixed(3),
    rate,
  };
};
