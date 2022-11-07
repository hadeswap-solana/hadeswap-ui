import { FC } from 'react';
import classNames from 'classnames';
import { MinusCircleIcon } from '../../icons/MinusCircleIcon';

import styles from './styles.module.scss';

interface ButtonProps {
  className?: string;
  onClick: () => void;
}

const DeleteButton: FC<ButtonProps> = ({ className, onClick }) => (
  <button
    className={classNames(styles.deleteButton, { [className]: className })}
    onClick={onClick}
  >
    <MinusCircleIcon />
  </button>
);

export default DeleteButton;
