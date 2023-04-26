import { FC } from 'react';
import cn from 'classnames';
import styles from './styles.module.scss';

export const PnftBadge: FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn(styles.wrapper, className)}>
      <span>pNFT</span>
    </div>
  );
};
