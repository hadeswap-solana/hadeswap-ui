import {
  BondingCurveType,
  OrderType,
  PairType,
} from 'hadeswap-sdk/lib/hadeswap-core/types';
import { helpers } from 'hadeswap-sdk/lib/hadeswap-core';

const checkIsFinite = (number: number): number => {
  if (isFinite(number)) {
    return number;
  } else {
    return 0;
  }
};

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

const calcStartingSellingPrice = ({
  delta,
  curveType,
  spotPrice,
  mathCounter = 0,
}: {
  delta: number;
  curveType: BondingCurveType;
  spotPrice: number;
  mathCounter: number;
}): number => {
  const price = helpers.calculateNextSpotPrice({
    orderType: OrderType.Buy,
    delta: delta,
    spotPrice: spotPrice,
    bondingCurveType: curveType,
    counter: mathCounter,
  });

  return checkIsFinite(price);
};

export const startingBuyingPrice = ({
  pairType,
  fee,
  spotPrice,
}: {
  pairType: PairType;
  fee: number;
  spotPrice: number;
}): number => {
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
  spotPrice,
  mathCounter = 0,
}: {
  pairType: PairType;
  curveType: BondingCurveType;
  fee: number;
  delta: number;
  spotPrice: number;
  mathCounter: number;
}): number => {
  return pairType === PairType.LiquidityProvision
    ? calcStartingPriceWithFees({
        price: calcStartingSellingPrice({
          delta,
          curveType,
          spotPrice,
          mathCounter,
        }),
        orderType: OrderType.Sell,
        fee,
      })
    : calcStartingSellingPrice({
        delta,
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
    pairType === PairType.LiquidityProvision
      ? buyOrdersAmount
      : buyOrdersAmount + nftsCount;

  const rawDelta = curveType === BondingCurveType.Linear ? delta / 1e9 : delta;

  const { total } = helpers.calculatePricesArray({
    starting_spot_price: spotPrice,
    delta: rawDelta,
    amount,
    bondingCurveType: curveType,
    orderType: OrderType.Sell,
    counter: mathCounter,
  }) as { total: number };

  return total;
};
