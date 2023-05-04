import { getFormattedPrice } from '../utils';

type UseCalcNftRoyalty = ({
  nftPrice,
  royaltyPercent,
  raw,
}: {
  nftPrice: number;
  royaltyPercent: number;
  raw?: boolean;
}) => number;

export const useCalcNftRoyalty: UseCalcNftRoyalty = ({
  nftPrice = 0,
  royaltyPercent = 0,
  raw = false,
}) => {
  if (raw) {
    const royalty = parseFloat(
      getFormattedPrice(nftPrice * (royaltyPercent / 100)),
    );
    return isFinite(royalty) ? royalty : 0;
  }
  return nftPrice * (royaltyPercent / 100);
};
