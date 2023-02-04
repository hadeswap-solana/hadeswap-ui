import { FC } from 'react';
import classNames from 'classnames';

import { BondingCurveType } from 'hadeswap-sdk/lib/hadeswap-core/types';
import { FormValuePriceBlock } from '../../PoolSettings/hooks/usePoolServicePrice';
import styles from './BondingCurveButtons.module.scss';

const bondingCurveButtons = [
  { value: BondingCurveType.Linear, name: 'linear curve' },
  { value: BondingCurveType.Exponential, name: 'exponential curve' },
  { value: BondingCurveType.XYK, name: 'xyk' },
];

interface PairButtonsProps {
  formValue: FormValuePriceBlock;
  setFormValue: (prev: any) => void;
  isDisabled: boolean;
}

const BondingCurveButtons: FC<PairButtonsProps> = ({
  formValue,
  setFormValue,
  isDisabled = false,
}) => {
  return (
    <div className={styles.wrapper}>
      {bondingCurveButtons.map(({ value, name }) => (
        <label
          key={value}
          className={classNames(styles.label, {
            [styles.checked]: formValue.curveType === value,
            [styles.disabled]: isDisabled,
          })}
          htmlFor={value}
        >
          <input
            disabled={isDisabled}
            id={value}
            type="radio"
            name="curve"
            value={value}
            checked={formValue.curveType === value}
            onChange={(e) =>
              setFormValue((prev: FormValuePriceBlock) => ({
                ...prev,
                curveType: e.target.value,
              }))
            }
          />
          {name}
        </label>
      ))}
    </div>
  );
};

export default BondingCurveButtons;
