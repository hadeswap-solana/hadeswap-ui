import { FC } from 'react';

import Checkbox from '../Checkbox';
import Button from '../Buttons/Button';
import styles from './styles.module.scss';

interface TransactionsWarningProps {
  onChange: () => void;
  onClick?: () => void;
  checked: boolean;
  outlined?: boolean;
  isDisabled?: boolean;
  label?: string;
  buttonText: string;
}

const TransactionsWarning: FC<TransactionsWarningProps> = ({
  onChange,
  onClick,
  checked,
  outlined = false,
  isDisabled,
  label = 'make sure you know that the transactions can go one by one',
  buttonText,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.checkboxWrapper}>
        <Checkbox label={label} checked={checked} onChange={onChange} />
      </div>
      <Button
        className={styles.button}
        outlined={outlined}
        isDisabled={isDisabled}
        onClick={onClick}
      >
        <span>{buttonText}</span>
      </Button>
    </div>
  );
};

export default TransactionsWarning;
