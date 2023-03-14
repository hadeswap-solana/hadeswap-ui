import { FC, ReactNode } from 'react';
import styles from './styles.module.scss';

export const ButtonsCard: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};
