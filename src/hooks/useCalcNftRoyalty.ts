import BN from 'bn.js';

type UseCalcNftRoyalty = ({
  nftPrice,
  royaltyPercent,
}: {
  nftPrice: number;
  royaltyPercent: number;
}) => BN;

export const useCalcNftRoyalty: UseCalcNftRoyalty = ({
  nftPrice = 0,
  royaltyPercent = 0,
}) => {
  const nftPriceBN = new BN(nftPrice);
  const royaltyPercentBN = new BN(royaltyPercent);
  return nftPriceBN.divRound(new BN(100)).mul(royaltyPercentBN);
};
