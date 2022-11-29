import { FC } from 'react';
import { Card } from '../Card';
import Button from '../Buttons/Button';
import classNames from 'classnames';

import styles from './styles.module.scss';

interface WithdrawFeesProps {
  accumulatedFees: string;
  onClick: () => Promise<void>;
  className?: string;
}

export const WithdrawFees: FC<WithdrawFeesProps> = ({
  accumulatedFees,
  onClick,
  className,
}) => (
  <Card className={classNames(styles.withdrawCard, className)}>
    <div className={styles.withdrawInfoWrapper}>
      <span className={styles.withdrawTitle}>fees</span>
      <span className={styles.withdrawValue}>{accumulatedFees}</span>
    </div>
    <Button outlined className={styles.withdrawButton} onClick={onClick}>
      <span>withdraw</span>
    </Button>
  </Card>
);
