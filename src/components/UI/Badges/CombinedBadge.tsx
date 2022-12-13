import { FC } from 'react';

import styles from './styles.module.scss';

interface CombinedBadgesProps {
  BaseBadge: JSX.Element;
  ShiftedBadge: JSX.Element;
}

export const CombinedBadges: FC<CombinedBadgesProps> = ({
  BaseBadge,
  ShiftedBadge,
}) => (
  <div className={styles.combinedBadges}>
    {BaseBadge}
    <div className={styles.shiftedBadge}>{ShiftedBadge}</div>
  </div>
);
