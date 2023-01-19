import { ChangeEvent, Dispatch, FC } from 'react';
import classNames from 'classnames';

import { BondingCurveType } from 'hadeswap-sdk/lib/hadeswap-core/types';
import styles from './BondingCurveButtons.module.scss';

const bondingCurveButtons = [
  { value: BondingCurveType.Linear, name: 'linear curve' },
  { value: BondingCurveType.Exponential, name: 'exponential curve' },
  { value: BondingCurveType.XYK, name: 'xyk' },
];

interface PairButtonsProps {
  curveType: string;
  setCurveType: Dispatch<string>;
  isDisabled: boolean;
}

const BondingCurveButtons: FC<PairButtonsProps> = ({
  curveType,
  setCurveType,
  isDisabled = false,
}) => {
  const curveHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setCurveType(e.target.value);
  };
  return (
    <div className={styles.wrapper}>
      {bondingCurveButtons.map(({ value, name }) => (
        <label
          key={value}
          className={classNames(styles.label, {
            [styles.checked]: curveType === value,
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
            checked={curveType === value}
            onChange={curveHandler}
          />
          {name}
        </label>
      ))}
    </div>
  );
};

export default BondingCurveButtons;
