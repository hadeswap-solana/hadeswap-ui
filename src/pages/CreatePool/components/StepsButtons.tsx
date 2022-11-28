import React, { FC } from 'react';
import { PairType } from 'hadeswap-sdk/lib/hadeswap-core/types';
import classNames from 'classnames';

import styles from './styles.module.scss';

interface StepsButtonsProps {
  step: number;
  setStep: React.Dispatch<(arg: number) => number>;
  chosenMarketKey: string;
  pairType: PairType;
}

export const StepsButtons: FC<StepsButtonsProps> = ({
  step,
  setStep,
  chosenMarketKey,
  pairType,
}) => {
  const onClick = (next: boolean) => {
    if (next) {
      step === 0 && chosenMarketKey && setStep((prev) => prev + 1);
      step === 1 && pairType && setStep((prev) => prev + 1);
    } else {
      setStep((prev) => prev - 1);
    }
  };

  return (
    <div className={styles.stepsButtonsWrapper}>
      <button
        onClick={() => onClick(false)}
        className={classNames(styles.stepButton, {
          [styles.stepButtonInvisible]: !step,
        })}
      >
        {'<'}&nbsp;&nbsp;back
      </button>
      {step !== 2 && (
        <button
          onClick={() => onClick(true)}
          className={classNames(styles.stepButton, {
            [styles.stepButtonDisabled]:
              (step === 0 && !chosenMarketKey) || (step === 1 && !pairType),
          })}
        >
          next&nbsp;&nbsp;{'>'}
        </button>
      )}
    </div>
  );
};
