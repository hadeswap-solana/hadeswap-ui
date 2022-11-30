import { FC } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

interface ButtonProps {
  className?: string;
  outlined?: boolean;
  isDisabled?: boolean;
  onClick?: (args?: any) => void;
  children: JSX.Element[] | JSX.Element;
}

const Button: FC<ButtonProps> = ({
  className,
  outlined,
  isDisabled = false,
  onClick,
  children,
}) => (
  <button
    className={classNames(
      styles.rootButton,
      styles.button,
      { [styles.outlined]: outlined },
      { [styles.disabled]: isDisabled },
      className,
    )}
    onClick={!isDisabled ? onClick : null}
  >
    {children}
  </button>
);

export default Button;
