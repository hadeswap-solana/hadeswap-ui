import { FC } from 'react';

import Checkbox from '../Checkbox';
import Button from '../Buttons/Button';
import { ButtonsCard } from '../UI/Cards/ButtonsCard';

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
    <ButtonsCard>
      <Checkbox label={label} checked={checked} onChange={onChange} />
      <Button outlined={outlined} isDisabled={isDisabled} onClick={onClick}>
        <span>{buttonText}</span>
      </Button>
    </ButtonsCard>
  );
};

export default TransactionsWarning;
