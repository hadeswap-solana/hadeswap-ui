import { useEffect, useRef, MutableRefObject } from 'react';
import { PairType } from 'hadeswap-sdk/lib/hadeswap-core/types';

export const useAssetsSetHeight = (
  pairType: PairType,
): {
  assetsBlockRef: MutableRefObject<HTMLDivElement>;
  priceBlockRef: MutableRefObject<HTMLDivElement>;
} => {
  const assetsBlockRef = useRef<HTMLDivElement>();
  const priceBlockRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (
      assetsBlockRef.current &&
      priceBlockRef.current &&
      pairType !== PairType.TokenForNFT
    ) {
      assetsBlockRef.current.style.height = `${priceBlockRef.current.offsetHeight}px`;
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [pairType, assetsBlockRef.current, priceBlockRef.current]);

  return {
    assetsBlockRef,
    priceBlockRef,
  };
};
