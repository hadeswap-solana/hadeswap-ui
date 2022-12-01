import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';

import { LoopIcon } from '../../icons/LoopIcon';
import styles from './styles.module.scss';
import Button from './Button';

interface ButtonProps {
  className?: string;
  onClick: (args?: any) => void;
}

export const SwapButton: FC<ButtonProps> = ({ className, onClick }) => {
  const { connected } = useWallet();

  return (
    <div className={styles.swapButtonWrapper}>
      <Button
        onClick={onClick}
        className={classNames(styles.swapButton, className)}
        isDisabled={!connected}
        outlined
      >
        <LoopIcon />
        <span>swap</span>
      </Button>
    </div>
  );
};
