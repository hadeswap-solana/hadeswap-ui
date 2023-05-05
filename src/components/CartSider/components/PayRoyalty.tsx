import React, { FC } from 'react';
import { PayRoyaltyCheckBox } from './PayRoyaltyCheckBox';
import styles from '../styles.module.scss';
import { SolanaLogo } from '../../../icons/SolanaLogo';
import { BN } from 'hadeswap-sdk';
import { formatRawSol } from '../../../utils/solanaUtils';

export interface PayRoyaltyData {
  enabled: boolean;
  pnft?: {
    isEmpty: boolean;
    royaltyPercent: BN;
    totalPrice: BN;
    totalRoyaltyPay: BN;
  };
  nft?: {
    isEmpty: boolean;
    royaltyPercent: BN;
    totalPrice: BN;
    totalRoyaltyPay: BN;
  };
}

interface PayRoyaltyProps {
  onTogglePayRoyalties: () => void;
  payRoyalty: PayRoyaltyData;
}

export const PayRoyalty: FC<PayRoyaltyProps> = ({
  payRoyalty,
  onTogglePayRoyalties,
}) => {
  const getFormatted = (value?: BN) =>
    value ? formatRawSol(value.toNumber()) : '';

  const nft = `(${payRoyalty.nft?.royaltyPercent?.toString()}%) ${getFormatted(
    payRoyalty.nft?.totalRoyaltyPay,
  )}`;

  const pnft = `(${payRoyalty.pnft?.royaltyPercent?.toString()}%) ${getFormatted(
    payRoyalty.pnft?.totalRoyaltyPay,
  )}`;

  return (
    <>
      {!payRoyalty.nft?.isEmpty && (
        <PayRoyaltyCheckBox
          isPayRoyalty={payRoyalty.enabled}
          onChange={onTogglePayRoyalties}
          value={nft}
        />
      )}
      {!payRoyalty.pnft?.isEmpty && (
        <div className={styles.payRoyalty}>
          <span className={styles.label}>pnft royalty</span>
          <div className={styles.value}>
            <span>{pnft}</span>
            <SolanaLogo />
          </div>
        </div>
      )}
    </>
  );
};
