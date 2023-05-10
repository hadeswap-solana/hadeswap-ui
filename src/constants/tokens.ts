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
  {
    label: 'MDS',
    value: TokensValues.MDS,
    image: 'https://arweave.net/DcmraYTxxarO5sZ1fIKdPIo1f76lRMZB_-q7y1d3Qqw',
  },
  {
    label: 'USDC',
    value: TokensValues.USDC,
    image:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
  },
  {
    label: 'MSOL',
    value: TokensValues.mSOL,
    image:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png',
  },
  {
    label: 'HADES',
    value: TokensValues.Hades,
    image: 'https://arweave.net/dvKu5BgpSo6j-iGzQOyVXYZ8OU7iyfhHNpkkJ_8qkkQ',
  },
  {
    label: 'BONK',
    value: TokensValues.Bonk,
    image: 'https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I',
  },
  {
    label: 'SAMO',
    value: TokensValues.SAMO,
    image:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU/logo.png',
  },
  {
    label: 'DUST',
    value: TokensValues.DUST,
    image:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ/logo.jpg',
  },
  {
    label: 'bSOL',
    value: TokensValues.bSOL,
    image:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1/logo.png',
  },
  {
    label: 'RLB',
    value: TokensValues.RLB,
    image:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/RLBxxFkseAZ4RgJH3Sqn8jXxhmGoz9jWxDNJMh8pL7a/logo.png',
  },
  {
    label: 'RAY',
    value: TokensValues.RAY,
    image:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png',
  },
  {
    label: 'GST',
    value: TokensValues.GST,
    image:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/AFbX8oGjGpmVFywbVouvhQSRmiW2aR1mohfahi4Y2AdB/logo.png',
  },
  {
    label: 'ORCA',
    value: TokensValues.ORCA,
    image:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE/logo.png',
  },
];
