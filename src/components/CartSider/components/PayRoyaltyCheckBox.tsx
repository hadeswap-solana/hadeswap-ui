import React, { FC } from 'react';
import styles from './styles.module.scss';
import { Toggle } from '../../Toggle';
import { SolanaLogo } from '../../../icons/SolanaLogo';

interface PayRoyaltyCheckBoxProps {
  isPayRoyalty: boolean;
  onChange: () => void;
  value: string;
}

export const PayRoyaltyCheckBox: FC<PayRoyaltyCheckBoxProps> = ({
  isPayRoyalty,
  onChange,
  value,
}) => {
  return (
    <div className={styles.payRoyalty}>
      <div>
        <Toggle
          label={'pay royalty'}
          checked={isPayRoyalty}
          onChange={onChange}
        />
      </div>
      <div className={styles.value}>
        <span>{value}</span>
        <SolanaLogo />
      </div>
    </div>
  );
};
