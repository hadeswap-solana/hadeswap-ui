import { FC } from 'react';
import classNames from 'classnames';
import { SolanaLogo } from '../../../icons/SolanaLogo';

import styles from './styles.module.scss';

export const SolRoundElement: FC = () => (
  <div className={classNames(styles.solanaBadge, styles.root)}>
    <SolanaLogo />
  </div>
);
