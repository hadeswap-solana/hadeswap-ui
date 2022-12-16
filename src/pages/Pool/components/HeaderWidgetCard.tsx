import { FC } from 'react';
import { Card } from '../../../components/Card';
import { shortenAddress } from '../../../utils/solanaUtils';
import { CloneIcon } from '../../../icons/CloneIcon';
import { copyToClipboard } from '../../../utils';

import styles from './styles.module.scss';

interface WidgetCardProps {
  title: string;
  value: string;
}

export const HeaderWidgetCard: FC<WidgetCardProps> = ({ value, title }) => (
  <Card className={styles.headerWidgetCard}>
    <h5 className={styles.widgetTitle}>{title}</h5>
    <div className={styles.widgetValueWrapper}>
      <span className={styles.widgetValue}>{shortenAddress(value)}</span>
      <button
        onClick={() => copyToClipboard(value)}
        className={styles.cloneButton}
      >
        <CloneIcon />
      </button>
    </div>
  </Card>
);
