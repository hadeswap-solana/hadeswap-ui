import { TokensValues } from '../types';

export interface TokenItem {
  label: string;
  value: TokensValues;
  image: string;
}

export const tokensList: TokenItem[] = [
  {
    label: 'SOL',
    value: TokensValues.SOL,
    image:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
  },
  // {
  //   label: 'USDC',
  //   value: TokensValues.USDC,
  //   image:
  //     'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
  // },
  // {
  //   label: 'MSOL',
  //   value: TokensValues.mSOL,
  //   image:
  //     'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png',
  // },
  // {
  //   label: 'HADES',
  //   value: TokensValues.Hades,
  //   image: 'https://arweave.net/dvKu5BgpSo6j-iGzQOyVXYZ8OU7iyfhHNpkkJ_8qkkQ',
  // },
  {
    label: 'BONK',
    value: TokensValues.Bonk,
    image: 'https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I',
  },
  // {
  //   label: 'SAMO',
  //   value: TokensValues.SAMO,
  //   image:
  //     'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU/logo.png',
  // },
  {
    label: 'DUST',
    value: TokensValues.DUST,
    image:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ/logo.jpg',
  },
];
