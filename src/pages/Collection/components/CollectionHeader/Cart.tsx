import { FC } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

interface CartProps {
  className?: string;
  children: JSX.Element | JSX.Element[];
  onClick?: () => void;
}

export const Cart: FC<CartProps> = ({
  className,
  children,
  onClick = null,
}) => (
  <div onClick={onClick} className={classNames(styles.cart, className)}>
    {children}
  </div>
);
