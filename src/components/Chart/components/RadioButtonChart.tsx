import { ChangeEvent, FC, useState } from 'react';
import classNames from 'classnames';
import { radioBtnPeriod } from './constants';
import styles from './RadioButtonChart.module.scss';

const RadioButtonChart: FC = () => {
  const [currentPeriod, setCurrentPeriod] = useState<string>('day');

  const periodHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentPeriod(e.target.value);
  };
  return (
    <div className={styles.radioButtonChart}>
      <div className={styles.wrapper}>
        {radioBtnPeriod.map(({ id, type, name, value }) => (
          <label
            key={id}
            className={classNames(styles.label, {
              [styles.checked]: currentPeriod === value,
            })}
            htmlFor={id}
          >
            <input
              id={id}
              type={type}
              name={name}
              value={value}
              checked={currentPeriod === value}
              onChange={periodHandler}
            />
            {value}
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioButtonChart;
