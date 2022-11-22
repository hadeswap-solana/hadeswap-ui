import { FC } from 'react';

import styles from './styles.module.scss';

interface TabButtonProps {
  title: string;
  data: number;
}

export const TabButton: FC<TabButtonProps> = ({ title, data }) => (
  <div className={styles.tabButton}>
    <span>{title}</span>
    <div className={styles.tabInfoWrapper}>
      <div className={styles.tabInfo}>{data}</div>
    </div>
  </div>
);
