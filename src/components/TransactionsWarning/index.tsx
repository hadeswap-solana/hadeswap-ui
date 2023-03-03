import { FC } from 'react';

import Checkbox from '../Checkbox';
import Button from '../Buttons/Button';
import styles from './styles.module.scss';

interface TransactionsWarningProps {
  onChange: () => void;
  onClick?: () => void;
  checked: boolean;
  isDisabled?: boolean;
  label?: string;
  buttonText?: string;
  title?: string;
}

const TransactionsWarning: FC<TransactionsWarningProps> = ({
  onChange,
  onClick,
  checked,
  isDisabled,
  label = 'make sure you know that the transactions can go one by one',
  buttonText,
  title,
}) => {
  return (
    <div className={styles.wrapper}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={styles.content}>
        <div className={styles.checkboxWrapper}>
          <Checkbox label={label} checked={checked} onChange={onChange} />
        </div>
        {buttonText && (
          <Button
            className={styles.button}
            outlined
            isDisabled={isDisabled}
            onClick={onClick}
          >
            <span>{buttonText}</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default TransactionsWarning;
