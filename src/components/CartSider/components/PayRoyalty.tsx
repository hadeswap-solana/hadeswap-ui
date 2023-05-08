import React, { FC } from 'react';
import { PayRoyaltyCheckBox } from './PayRoyaltyCheckBox';
import styles from '../styles.module.scss';
import { SolanaLogo } from '../../../icons/SolanaLogo';
import { BN } from 'hadeswap-sdk';
import { formatRawSol } from '../../../utils/solanaUtils';
import { CartItemsPayRoyalties } from '../hooks';

interface PayRoyaltyProps {
  onTogglePayRoyalties: () => void;
  payRoyaltyEnabled: boolean;
  payRoyalty: CartItemsPayRoyalties;
}

export const PayRoyalty: FC<PayRoyaltyProps> = ({
  payRoyalty,
  onTogglePayRoyalties,
  payRoyaltyEnabled,
}) => {
  const getFormatted = (value?: BN) =>
    value ? formatRawSol(value.toNumber()) : '';

  const getFormattedTotalPayRoyaltyForNft = () => {
    let totalPayRoyalty = new BN(0);
    let totalPercentPayRoyalty = new BN(0);
    let totalPrice = new BN(0);

    if (!payRoyalty.buy.nft.isEmpty) {
      totalPayRoyalty = totalPayRoyalty.add(payRoyalty.buy.nft.totalRoyaltyPay);
      totalPrice = totalPrice.add(payRoyalty.buy.nft.totalPrice);
    }

    if (!payRoyalty.sell.nft.isEmpty) {
      totalPayRoyalty = totalPayRoyalty.add(
        payRoyalty.sell.nft.totalRoyaltyPay,
      );
      totalPrice = totalPrice.add(payRoyalty.sell.nft.totalPrice);
    }

    totalPercentPayRoyalty = totalPayRoyalty
      .mul(new BN(100))
      .divRound(totalPrice);

    return `(${totalPercentPayRoyalty.toString()}%) ${getFormatted(
      totalPayRoyalty,
    )}`;
  };

  const getFormattedTotalPayRoyaltyForPnft = () => {
    let totalPayRoyalty = new BN(0);
    let totalPercentPayRoyalty = new BN(0);
    let totalPrice = new BN(0);

    if (!payRoyalty.buy.pnft.isEmpty) {
      totalPayRoyalty = totalPayRoyalty.add(
        payRoyalty.buy.pnft.totalRoyaltyPay,
      );
      totalPrice = totalPrice.add(payRoyalty.buy.pnft.totalPrice);
    }

    if (!payRoyalty.sell.pnft.isEmpty) {
      totalPayRoyalty = totalPayRoyalty.add(
        payRoyalty.sell.pnft.totalRoyaltyPay,
      );
      totalPrice = totalPrice.add(payRoyalty.sell.pnft.totalPrice);
    }

    totalPercentPayRoyalty = totalPayRoyalty
      .mul(new BN(100))
      .divRound(totalPrice);

    return `(${totalPercentPayRoyalty.toString()}%) ${getFormatted(
      totalPayRoyalty,
    )}`;
  };

  return (
    <>
      {(!payRoyalty.buy.nft.isEmpty || !payRoyalty.sell.nft.isEmpty) && (
        <PayRoyaltyCheckBox
          isPayRoyalty={payRoyaltyEnabled}
          onChange={onTogglePayRoyalties}
          value={getFormattedTotalPayRoyaltyForNft()}
        />
      )}
      {(!payRoyalty.buy.pnft.isEmpty || !payRoyalty.sell.pnft.isEmpty) && (
        <div className={styles.payRoyalty}>
          <span className={styles.label}>pnft royalty</span>
          <div className={styles.value}>
            <span>{getFormattedTotalPayRoyaltyForPnft()}</span>
            <SolanaLogo />
          </div>
        </div>
      )}
    </>
  );
};
