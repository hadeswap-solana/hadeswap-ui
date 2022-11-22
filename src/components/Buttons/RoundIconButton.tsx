import { FC } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

interface ButtonProps {
  className?: string;
  onClick: () => void;
  children: JSX.Element;
}

const RoundIconButton: FC<ButtonProps> = ({ className, onClick, children }) => (
  <button
    className={classNames(
      styles.rootButton,
      styles.roundIconWrapper,
      className,
    )}
    onClick={onClick}
  >
    {children}
  </button>
);

export default RoundIconButton;
