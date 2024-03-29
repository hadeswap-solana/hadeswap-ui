import React, { FC } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

interface BlackButtonProps {
  onClick: () => void;
  className?: string;
  isInvisible?: boolean;
  isDisabled?: boolean;
  children: JSX.Element | string;
}

export const BlackButton: FC<BlackButtonProps> = ({
  onClick,
  className,
  isInvisible,
  isDisabled,
  children,
}) => {
  return (
    <button
      onClick={onClick}
      className={classNames(
        styles.rootButton,
        styles.blackButton,
        { [styles.invisible]: isInvisible },
        { [styles.disabled]: isDisabled },
        className,
      )}
    >
      {children}
    </button>
  );
};
