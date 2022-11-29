import { FC } from 'react';
import { Card } from '../../../components/Card';
import { shortenAddress } from '../../../utils/solanaUtils';
import { CloneIcon } from '../../../icons/CloneIcon';

import styles from './styles.module.scss';

interface WidgetCardProps {
  title: string;
  pairPubkey: string;
}

export const HeaderWidgetCard: FC<WidgetCardProps> = ({
  pairPubkey,
  title,
}) => (
  <Card className={styles.headerWidgetCard}>
    <h5 className={styles.widgetTitle}>{title}</h5>
    <div className={styles.widgetValueWrapper}>
      <span className={styles.widgetValue}>{shortenAddress(pairPubkey)}</span>
      <button
        onClick={() => navigator.clipboard.writeText(pairPubkey)}
        className={styles.cloneButton}
      >
        <CloneIcon />
      </button>
    </div>
  </Card>
);
