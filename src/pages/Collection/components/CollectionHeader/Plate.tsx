import { FC } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

interface PlateProps {
  className?: string;
  children: JSX.Element | JSX.Element[];
  onClick?: () => void;
}

export const Plate: FC<PlateProps> = ({
  className,
  children,
  onClick = null,
}) => (
  <div onClick={onClick} className={classNames(styles.plate, className)}>
    {children}
  </div>
);
