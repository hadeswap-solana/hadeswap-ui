import { FC } from 'react';

import Checkbox from '../../../../components/Checkbox/Checkbox';
import Button from '../../../../components/Buttons/Button';

import styles from './styles.module.scss';

interface WithdrawLiquidityProps {
  onChange: () => void;
  onClick: () => void;
  checked: boolean;
  isDisabled: boolean;
}

const WithdrawLiquidity: FC<WithdrawLiquidityProps> = ({
  onChange,
  onClick,
  checked,
  isDisabled,
}) => {
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>withdraw all liquidity</h3>
      <div className={styles.content}>
        <div className={styles.checkboxWrapper}>
          <Checkbox
            label={
              ' make sure you know that the transactions can go one by one'
            }
            checked={checked}
            onChange={onChange}
          />
        </div>
        <Button
          className={styles.button}
          outlined
          isDisabled={isDisabled}
          onClick={onClick}
        >
          <span>withdraw</span>
        </Button>
      </div>
    </div>
  );
};

export default WithdrawLiquidity;
