import { ReactNode } from 'react';
import { web3 } from 'hadeswap-sdk';

export interface TxnData {
  transaction: web3.Transaction;
  signers?: web3.Signer[];
  loadingModalCard?: ReactNode;
}
