import { notification } from 'antd';
import { web3, BN } from 'hadeswap-sdk';
import {
  calculateNextSpotPrice,
  deriveXykBaseSpotPriceFromCurrentSpotPrice,
} from 'hadeswap-sdk/lib/hadeswap-core/helpers';
import {
  BondingCurveType,
  OrderType,
  PairType,
} from 'hadeswap-sdk/lib/hadeswap-core/types';
import { formatNumber, Notify, NotifyType } from './solanaUtils';
import { Dictionary } from 'lodash';
import { NotifyErrorIcon } from '../icons/NotifyErrorIcon';
import { NotifyInfoIcon } from '../icons/NotifyInfoIcon';
import { NotifySuccessIcon } from '../icons/NotifySuccessIcon';
import { Notify, NotifyType } from './solanaUtils';

export enum PoolType {
  tokenForNft = 'buy',
  nftForToken = 'sell',
  liquidityProvision = 'liquidity provision',
}

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

export const closeNotification = (id: string): void => {
  notification.close(id);
};

export const DECIMALS_PER_FRKT = 1e8;

//? Using for fetching prices of tokens in USD
export const COINGECKO_URL = process.env.COINGECKO_URL;

// export const SOL_TOKEN: TokenInfo = {
//   chainId: 101,
//   address: 'So11111111111111111111111111111111111111112',
//   name: 'SOL',
//   decimals: 9,
//   symbol: 'SOL',
//   logoURI:
//     'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
//   extensions: {
//     coingeckoId: 'solana',
//   },
// };

export const USDT_TOKEN = {
  chainId: 101,
  address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  symbol: 'USDT',
  name: 'USDT',
  decimals: 6,
  logoURI:
    'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg',
  tags: ['stablecoin'],
  extensions: {
    coingeckoId: 'tether',
    serumV3Usdc: '77quYg4MGneUdjgXCunt9GgM1usmrxKY31twEy3WHwcS',
    website: 'https://tether.to/',
  },
};

export const USDC_TOKEN = {
  chainId: 101,
  address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  symbol: 'USDC',
  name: 'USD Coin',
  decimals: 6,
  logoURI:
    'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
  tags: ['stablecoin'],
  extensions: {
    coingeckoId: 'usd-coin',
    serumV3Usdt: '77quYg4MGneUdjgXCunt9GgM1usmrxKY31twEy3WHwcS',
    website: 'https://www.centre.io/',
  },
};

export const decimalBNToString = (
  bn: BN,
  precision = 2,
  decimals = 9,
): string => {
  const bnStr = bn.toString(10).padStart(decimals, '0');
  if (bnStr === '0') return '0';
  const integerPart = bnStr.slice(0, -decimals);

  let floatPart = bnStr.slice(bnStr.length - decimals);
  const number = floatPart.replace(/^0+/g, '').replace(/0+$/g, '');
  floatPart = floatPart.replace(/0+$/g, '');

  if (floatPart.length - number.length < precision) {
    floatPart = floatPart.slice(0, precision);
  }

  if (floatPart) floatPart = '.' + floatPart;
  return `${integerPart || 0}${floatPart}`;
};

export const shortBigNumber = (bn: BN, precision = 2, decimals = 9): string => {
  const abbrev = ['K', 'M', 'B', 'T'];
  const dec = [3, 6, 9, 12];
  const bnString = bn.toString();

  if (bnString.length >= decimals + dec[0]) {
    const decimalString = bn.toString().slice(0, -decimals);

    for (let i = dec.length - 1; i >= 0; i--) {
      const curDec = dec[i];
      if (decimalString.length <= curDec) continue;

      const result = decimalString.slice(
        0,
        decimalString.length - curDec + precision,
      );
      let floatPart = result.slice(-precision).replace(/0+$/g, '');
      if (floatPart) floatPart = '.' + floatPart;
      return `${result.slice(0, -precision) || 0}${floatPart}${abbrev[i]}`;
    }
  }

  return decimalBNToString(bn, precision, decimals);
};

export const frktBNToString = (bn: BN, precision = 6): string => {
  const bnStr = bn.toString(10);
  if (bnStr === '0') return '0';
  const integerPart = bnStr.slice(0, -8);
  const floatPart = bnStr.padStart(8, '0').slice(-8, -8 + precision);
  return `${integerPart || 0}.${floatPart || 0}`;
};

export const getFrktBalanceValue = (balance: BN): string => {
  const frktBalance = balance ? frktBNToString(balance, 2) : '0';
  return `${frktBalance !== '0' ? frktBalance : '--'}`;
};

export const getSolBalanceValue = (account: web3.AccountInfo<Buffer>): string =>
  `${formatNumber.format((account?.lamports || 0) / web3.LAMPORTS_PER_SOL)}`;

export const getTokenBalanceValue = (amountBN: BN, decimals: number): string =>
  `${formatNumber.format(
    (amountBN?.toNumber() || 0) / Math.pow(10, decimals),
  )}`;

export const copyToClipboard = (value: string): void => {
  navigator.clipboard.writeText(value);
  notify({
    message: 'Copied to clipboard',
    type: NotifyType.SUCCESS,
  });
};

export const getCollectionThumbnailUrl = (thumbaiUrl: string): string => {
  return `https://cdn.exchange.art/${thumbaiUrl?.replace(/ /g, '%20')}`;
};

export const pluralize = (count: number, noun: string, suffix = 's'): string =>
  `${count} ${noun}${count !== 1 ? suffix : ''}`;

export const swapStringKeysAndValues = (
  obj: Dictionary<string>,
): Dictionary<string> => {
  const swapped = Object.entries(obj).map(([key, value]) => [value, key]);

  return Object.fromEntries(swapped);
};

export const fetchSolanaPriceUSD = async (): Promise<number> => {
  try {
    const result = await (
      await fetch(`${COINGECKO_URL}/simple/price?ids=solana&vs_currencies=usd`)
    ).json();

    return result?.solana?.usd || 0;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('coingecko api error: ', error);
    return 0;
  }
};
export const getStakingPointsURL = (walletAddress: web3.PublicKey): string =>
  `https://frakt-stats.herokuapp.com/staking/${walletAddress}`;

export const getCorrectSolWalletBalance = (
  solWalletBalance: string,
): string => {
  return solWalletBalance.split(',').join('');
};

export const getDiscordUri = (wallet: web3.PublicKey | string): string => {
  const redirectUri = `https://${process.env.BACKEND_DOMAIN}/user`;
  const clientId = process.env.DISCORD_CLIENT_ID;

  return `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri,
  )}&response_type=code&scope=identify&state=${wallet}`;
};

export const getDiscordAvatarUrl = (discordId = '', hash = ''): string | null =>
  discordId && hash
    ? `https://cdn.discordapp.com/avatars/${discordId}/${hash}.png`
    : null;

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

export const formatNumericDigit = (number: number): string => {
  const value = number.toFixed(2);
  const integer = Math.trunc(number);
  const integerStr = String(integer);
  const tale = (Number(value) - integer).toFixed(2).substring(1) || '';

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

    return formattedArr.join('') + tale;
  }
  return value;
};

export const calcTokenAmount = (
  solAmount: string,
  tokenRate: number,
): string => {
  const amount = (Number(solAmount) + 0.05) * tokenRate;
  return (amount * tokenRate).toFixed(2);
};

export const PUBKEY_PLACEHOLDER = '11111111111111111111111111111111';

export const getRawDelta = ({
  delta,
  curveType,
  buyOrdersAmount,
  nftsAmount,
  mathCounter,
  pairType,
}: {
  delta: number;
  curveType: BondingCurveType;
  buyOrdersAmount: number;
  nftsAmount: number;
  mathCounter: number;

  pairType: PairType;
}): number => {
  const deltaSerializer = {
    [BondingCurveType.Exponential]: delta * 100,
    [BondingCurveType.Linear]: delta * 1e9,
    [BondingCurveType.XYK]: Math.max(
      buyOrdersAmount - mathCounter,
      nftsAmount + mathCounter,
    ),
    //  Math.ceil(
    //   (buyOrdersAmount + nftsAmount) /
    //   (pairType === PairType.LiquidityProvision ? 2 : 1),
    // ),
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
