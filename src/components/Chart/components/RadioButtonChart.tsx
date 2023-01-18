import { ChangeEvent, Dispatch, FC, SetStateAction } from 'react';
import classNames from 'classnames';
import { radioBtnPeriod } from './constants';
import styles from './RadioButtonChart.module.scss';

interface RadioButtonChartProps {
  currentPeriod: string;
  setCurrentPeriod: Dispatch<SetStateAction<string>>;
}

const RadioButtonChart: FC<RadioButtonChartProps> = ({
  currentPeriod,
  setCurrentPeriod,
}) => {
  const periodHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentPeriod(e.target.value);
  };
  return (
    <div className={styles.radioButtonChart}>
      <div className={styles.wrapper}>
        {radioBtnPeriod.map(({ period, type, name, value }) => (
          <label
            key={period}
            className={classNames(styles.label, {
              [styles.checked]: currentPeriod === value,
            })}
            htmlFor={period}
          >
            <input
              id={period}
              type={type}
              name={name}
              value={value}
              checked={currentPeriod === value}
              onChange={periodHandler}
            />
            {period}
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioButtonChart;
