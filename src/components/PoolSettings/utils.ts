import {
  BondingCurveType,
  OrderType,
  PairType,
} from 'hadeswap-sdk/lib/hadeswap-core/types';
import { helpers } from 'hadeswap-sdk/lib/hadeswap-core';

const calcStartingPriceWithFees = ({
  price,
  orderType,
  fee,
}: {
  price: number;
  orderType: OrderType;
  fee: number;
}): number => {
  return orderType === OrderType.Buy
    ? price - (price / 100) * fee
    : price + (price / 100) * fee;
};

const calcDelta = (curveType: BondingCurveType, delta: number): number => {
  if (curveType === BondingCurveType.Exponential) return delta * 100;
  if (curveType === BondingCurveType.XYK) return delta + 1;
  return delta;
};

const calcStartingSellingPrice = ({
  delta,
  nftsCount,
  curveType,
  spotPrice,
  mathCounter = 0,
}: {
  delta: number;
  nftsCount: number;
  curveType: BondingCurveType;
  spotPrice: number;
  mathCounter: number;
}): number => {
  // const price = helpers.calculateNextSpotPrice({
  //   orderType: OrderType.Buy,
  //   delta: calcDelta(curveType, delta),
  //   spotPrice: spotPrice,
  //   bondingCurveType: curveType,
  //   counter: mathCounter,
  // });
  // console.log('orderType', OrderType.Buy);
  // console.log('delta', calcDelta(curveType, delta));
  // console.log('spotPrice', spotPrice);
  // console.log('bondingCurveType', curveType);
  // console.log('mathCounter', mathCounter);

  // const orderType = curveType === BondingCurveType.XYK ? OrderType.Sell : OrderType.Buy;
  const deltaValue =
    curveType === BondingCurveType.XYK
      ? nftsCount + 1
      : calcDelta(curveType, delta);

  return helpers.calculateNextSpotPrice({
    orderType: OrderType.Buy,
    delta: deltaValue,
    spotPrice: spotPrice,
    bondingCurveType: curveType,
    counter: mathCounter,
  });
};

export const startingBuyingPrice = ({
  pairType,
  fee,
  spotPrice,
  nftsCount,
  curveType,
  mathCounter = 0,
}: {
  pairType: PairType;
  fee: number;
  spotPrice: number;
  nftsCount: number;
  curveType: BondingCurveType;
  mathCounter: number;
}): number => {
  if (curveType === BondingCurveType.XYK) {
    return helpers.calculateNextSpotPrice({
      orderType: OrderType.Sell,
      delta: nftsCount + 1,
      spotPrice: spotPrice,
      bondingCurveType: curveType,
      counter: mathCounter,
    });
  }
  return pairType === PairType.LiquidityProvision
    ? calcStartingPriceWithFees({
        price: spotPrice,
        orderType: OrderType.Buy,
        fee,
      })
    : spotPrice;
};

export const startingSellingPrice = ({
  pairType,
  curveType,
  fee,
  delta,
  nftsCount,
  spotPrice,
  mathCounter,
}: {
  pairType: PairType;
  curveType: BondingCurveType;
  fee: number;
  delta: number;
  nftsCount: number;
  spotPrice: number;
  mathCounter: number;
}): number => {
  if (curveType === BondingCurveType.XYK && !nftsCount) return 0;

  return pairType === PairType.LiquidityProvision
    ? calcStartingPriceWithFees({
        price: calcStartingSellingPrice({
          delta,
          nftsCount,
          curveType,
          spotPrice,
          mathCounter,
        }),
        orderType: OrderType.Sell,
        fee,
      })
    : calcStartingSellingPrice({
        delta,
        nftsCount,
        curveType,
        spotPrice,
        mathCounter,
      });
};

export const priceLockedIntoPool = ({
  pairType,
  spotPrice,
  delta,
  buyOrdersAmount,
  nftsCount,
  curveType,
  mathCounter = 0,
}: {
  pairType: PairType;
  spotPrice: number;
  delta: number;
  buyOrdersAmount: number;
  nftsCount: number;
  curveType: BondingCurveType;
  mathCounter: number;
}): number => {
  const amount =
    pairType === PairType.TokenForNFT ? buyOrdersAmount : nftsCount;

  const calcDeltaValue = () => {
    if (pairType === PairType.TokenForNFT) {
      return curveType === BondingCurveType.XYK ? buyOrdersAmount + 1 : delta;
    }
    return curveType === BondingCurveType.XYK ? nftsCount + 1 : delta;
  };
  const deltaValue = calcDeltaValue();

  const { total } = helpers.calculatePricesArray({
    starting_spot_price: spotPrice,
    delta: deltaValue,
    amount,
    bondingCurveType: curveType,
    orderType: OrderType.Sell,
    counter: mathCounter + 1,
  }) as { total: number };

  return total;
};
