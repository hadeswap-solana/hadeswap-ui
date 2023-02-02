import { Tokens } from '../../../../types';

export interface TokensList {
  label: string;
  value: Tokens;
}

export const tokensList: TokensList[] = [
  { label: 'USDC', value: Tokens.USDC },
  { label: 'MSOL', value: Tokens.MSOL },
  { label: 'Hades', value: Tokens.Hades },
  { label: 'Bonk', value: Tokens.Bonk },
  { label: 'SAMO', value: Tokens.SAMO },
];
