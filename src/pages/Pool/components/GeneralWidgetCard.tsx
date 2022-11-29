import { FC } from 'react';
import { Card } from '../../../components/Card';

import styles from './styles.module.scss';

interface GeneralWidgetCardProps {
  title: string;
  value: string;
}

export const GeneralWidgetCard: FC<GeneralWidgetCardProps> = ({
  title,
  value,
}) => (
  <Card className={styles.generalWidgetCard}>
    <span className={styles.widgetTitle}>{title}</span>
    <span className={styles.widgetValue}>{value}</span>
  </Card>
);
