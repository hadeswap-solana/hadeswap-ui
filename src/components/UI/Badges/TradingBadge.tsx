import { FC } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

export const TradingBadge: FC = () => (
  <div className={classNames(styles.tradingBadge, styles.root)}>
    <span>trading fees</span>
  </div>
);
