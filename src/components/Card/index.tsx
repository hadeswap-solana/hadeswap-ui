import { FC } from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';

interface CardProps {
  children: JSX.Element | JSX.Element[];
  className: string;
  onClick?: (arg: any) => void;
}

export const Card: FC<CardProps> = ({ children, className, onClick }) => (
  <div className={classNames(styles.card, className)} onClick={onClick}>
    {children}
  </div>
);
