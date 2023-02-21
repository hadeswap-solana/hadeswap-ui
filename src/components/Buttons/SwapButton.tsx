import { FC, MouseEvent } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';
import Button from './Button';
import { LoopIcon } from '../../icons/LoopIcon';

import styles from './styles.module.scss';

interface ButtonProps {
  className?: string;
  onClick: (args?: MouseEvent<HTMLButtonElement> | TouchEvent) => void;
  isDisabled?: boolean;
}

export const SwapButton: FC<ButtonProps> = ({
  className,
  onClick,
  isDisabled = false,
}) => {
  const { connected } = useWallet();

  return (
    <div className={styles.swapButtonWrapper}>
      <Button
        isDisabled={isDisabled || !connected}
        onClick={onClick}
        className={classNames(
          styles.swapButton,
          (!connected || isDisabled) && styles.notConnectedBtn,
          className,
        )}
        outlined
      >
        <LoopIcon />
        <span>swap</span>
      </Button>
    </div>
  );
};
