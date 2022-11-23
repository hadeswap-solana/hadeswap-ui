import { FC } from 'react';
import { SolanaLogo } from '../../../icons/SolanaLogo';
import styles from './styles.module.scss';

export const SolRoundElement: FC = () => (
  <div className={styles.wrapper}>
    <SolanaLogo />
  </div>
);
