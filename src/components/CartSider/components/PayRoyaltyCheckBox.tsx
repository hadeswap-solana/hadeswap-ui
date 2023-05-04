import React from 'react';
import styles from './styles.module.scss';
import { Toggle } from '../../Toggle';
import { SolanaLogo } from '../../../icons/SolanaLogo';

interface Props {
  isPayRoyalty: boolean;
  onChange: () => void;
  value: string;
}

export const PayRoyaltyCheckBox = ({
  isPayRoyalty,
  onChange,
  value,
}: Props) => {
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
