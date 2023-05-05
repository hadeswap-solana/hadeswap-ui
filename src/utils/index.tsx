import { notification } from 'antd';
import { BN } from 'hadeswap-sdk';
import {
  calculateNextSpotPrice,
  deriveXykBaseSpotPriceFromCurrentSpotPrice,
} from 'hadeswap-sdk/lib/hadeswap-core/helpers';
import {
  BondingCurveType,
  OrderType,
} from 'hadeswap-sdk/lib/hadeswap-core/types';
import { Notify, NotifyType } from './solanaUtils';
import { NotifyErrorIcon } from '../icons/NotifyErrorIcon';
import { NotifyInfoIcon } from '../icons/NotifyInfoIcon';
import { NotifySuccessIcon } from '../icons/NotifySuccessIcon';

const iconsNotify = {
  [NotifyType.INFO]: <NotifyInfoIcon />,
  [NotifyType.SUCCESS]: <NotifySuccessIcon />,
  [NotifyType.ERROR]: <NotifyErrorIcon />,
};

export const notify: Notify = ({
  message = '',
  description = null,
  type = NotifyType.INFO,
  persist = false,
  key = '',
}) => {
  notification[type]({
    className: 'fraktion__notification',
    message,
    description,
    placement: 'bottomRight',
    duration: persist ? 0 : 4.5,
    icon: iconsNotify[type],
    key,
  });
};

export const copyToClipboard = (value: string): void => {
  navigator.clipboard.writeText(value);
  notify({
    message: 'Copied to clipboard',
    type: NotifyType.SUCCESS,
  });
};

export const compareNumbers = (
  numberA: number,
  numberB: number,
  desc = true,
): number => {
  if (desc) return numberA - numberB;
  return numberB - numberA;
};

export const compareStrings = (stringA: string, stringB: string): number =>
  stringA.localeCompare(stringB);

export const specifyAndSort = (
  valueA: string | number,
  valueB: string | number,
): number => {
  if (!isNaN(Number(valueA))) {
    return compareNumbers(
      parseFloat(String(valueA as number)),
      parseFloat(String(valueB as number)),
    );
  }
  return compareStrings(valueA as string, valueB as string);
};

export const formatBNToString = (
  number: BN,
  decimals = 9,
  precision = 2,
): string => {
  try {
    if (number.eq(new BN(0))) {
      return '0';
    } else {
      return (number.toNumber() / 10 ** decimals).toFixed(precision);
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getFormattedPrice = (price: number): string => {
  return price > 0 ? formatBNToString(new BN(price)) : '';
};

export const formatNumericDigit = (value: string): string => {
  const integerStr = String(Math.trunc(Number(value)));
  const numberStr = String(Number(value));
  const dotIndex = numberStr.lastIndexOf('.');
  const tale = numberStr.substring(dotIndex);

  if (integerStr.length > 3) {
    const numberArr = integerStr.split('');
    let step = integerStr.length % 3;

    const formattedArr = numberArr.map((item, index) => {
      const value = index === step ? ` ${item}` : `${item}`;
      if (index === step) {
        step += 3;
      }
      return value;
    });

    if (dotIndex === -1) {
      return formattedArr.join('');
    }
    return formattedArr.join('') + tale;
  }

  return numberStr;
};

export const calcTokenAmount = (
  solAmount: string,
  tokenRate: number,
): string => {
  const amount = Number(solAmount) * tokenRate;
  return (amount + amount / 100).toFixed(3);
};

export const PUBKEY_PLACEHOLDER = '11111111111111111111111111111111';

export const getRawDelta = ({
  delta,
  curveType,
  buyOrdersAmount,
  nftsAmount,
  mathCounter,
}: {
  delta: number;
  curveType: BondingCurveType;
  buyOrdersAmount: number;
  nftsAmount: number;
  mathCounter: number;
}): number => {
  const deltaSerializer = {
    [BondingCurveType.Exponential]: delta * 100,
    [BondingCurveType.Linear]: delta * 1e9,
    [BondingCurveType.XYK]: Math.max(
      buyOrdersAmount - mathCounter,
      nftsAmount + mathCounter,
    ),
  };
  return deltaSerializer[curveType] || 0;
};

export const getRawSpotPrice = ({
  rawDelta,
  spotPrice,
  mathCounter,
  curveType,
}: {
  rawDelta: number;
  spotPrice: number;
  mathCounter: number;
  curveType: BondingCurveType;
}): number => {
  const baseSpotPrice = Math.ceil(
    calculateNextSpotPrice({
      orderType: OrderType.Buy,
      delta: rawDelta,
      bondingCurveType: curveType,
      spotPrice: spotPrice * 1e9,
      counter: -mathCounter - 1,
    }),
  );

  return curveType === BondingCurveType.XYK
    ? deriveXykBaseSpotPriceFromCurrentSpotPrice({
        currentSpotPrice: Math.ceil(spotPrice * 1e9),
        counter: mathCounter,
        delta: rawDelta,
      })
    : baseSpotPrice;
};

export interface Royalties {
  royaltyPercent: BN;
  totalPrice: BN;
  totalRoyaltyPay: BN;
}

export const getRoyalties = (
  nfts: Array<{
    market: string;
    nftPrice: BN;
    royaltyPercent: number;
    isPnft: boolean;
  }>,
): Royalties => {
  if (!nfts.length) {
    return {
      royaltyPercent: new BN(0),
      totalPrice: new BN(0),
      totalRoyaltyPay: new BN(0),
    };
  }

  const nftsByMarket = nfts.reduce((acc, item) => {
    if (acc[item.market]) {
      acc[item.market] = {
        nfts: [...acc[item.market], item],
        royaltyPercent: new BN(item.royaltyPercent),
        totalNftsPrice: acc[item.market].totalNftsPrice.add(item.nftPrice),
      };

      return acc;
    }

    acc[item.market] = {
      nfts: [item],
      royaltyPercent: new BN(item.royaltyPercent),
      totalNftsPrice: item.nftPrice,
    };
    return acc;
  }, {});

  const marketsRoyalties = Object.keys(nftsByMarket).reduce((acc, item) => {
    const market = nftsByMarket[item];

    acc[item] = {
      totalPrice: market.totalNftsPrice,
      percent: market.royaltyPercent,
      royaltyValue: market.totalNftsPrice
        .div(new BN(100))
        .mul(market.royaltyPercent),
    };
    return acc;
  }, {});

  const totalRoyalties = Object.keys(marketsRoyalties).reduce(
    (acc, k) => {
      acc.totalPercent = acc.totalPercent.add(marketsRoyalties[k].percent);
      acc.royaltyValue = acc.royaltyValue.add(marketsRoyalties[k].royaltyValue);
      acc.totalPrice = acc.totalPrice.add(marketsRoyalties[k].totalPrice);
      return acc;
    },
    {
      totalPercent: new BN(0),
      totalPrice: new BN(0),
      royaltyValue: new BN(0),
    },
  );

  return {
    royaltyPercent: totalRoyalties.royaltyValue
      .mul(new BN(100))
      .divRound(totalRoyalties.totalPrice),
    totalPrice: totalRoyalties.totalPrice,
    totalRoyaltyPay: totalRoyalties.royaltyValue,
  };
};
