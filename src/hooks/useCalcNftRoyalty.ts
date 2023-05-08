import BN from 'bn.js';

type UseCalcNftRoyalty = ({
  nftPrice,
  royaltyPercent,
}: {
  nftPrice: number;
  royaltyPercent: number;
}) => number;

export const useCalcNftRoyalty: UseCalcNftRoyalty = ({
  nftPrice = 0,
  royaltyPercent = 0,
}) => {
  return (nftPrice / 100) * royaltyPercent;
};
