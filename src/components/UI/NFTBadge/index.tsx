import { FC } from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';

export const NFTBadge: FC<{ className?: string }> = ({ className }) => (
  <div className={classNames(styles.wrapper, className)}>
    <span>NFT</span>
  </div>
);
