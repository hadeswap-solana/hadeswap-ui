import { FC } from 'react';
import classNames from 'classnames';
import { LoopIcon } from '../../icons/LoopIcon';
import Button from './Button';

import styles from './styles.module.scss';

interface ButtonProps {
  className?: string;
  onClick: (args?: any) => void;
}

export const SwapButton: FC<ButtonProps> = ({ className, onClick }) => (
  <div className={styles.swapButtonWrapper}>
    <Button
      onClick={onClick}
      className={classNames(styles.swapButton, className)}
      outlined
    >
      <LoopIcon />
      <span>swap</span>
    </Button>
  </div>
);
