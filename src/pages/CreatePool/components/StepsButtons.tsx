import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { PairType } from 'hadeswap-sdk/lib/hadeswap-core/types';
import { BlackButton } from '../../../components/Buttons/BlackButton';
import { createCreatePoolPickSideLink } from '../../../constants';

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
  const history = useHistory();
  const onClick = (next: boolean) => {
    if (next) {
      step === 0 && chosenMarketKey && setStep((prev) => prev + 1);
      step === 1 && pairType && setStep((prev) => prev + 1);
      history.push(createCreatePoolPickSideLink(chosenMarketKey));
    } else {
      step === 1 && history.push('/create-pool');
      step === 2 && history.push(createCreatePoolPickSideLink(chosenMarketKey));
      setStep((prev) => prev - 1);
    }
  };

  return (
    <div className={styles.stepsButtonsWrapper}>
      <BlackButton onClick={() => onClick(false)} isInvisible={!step}>
        <span>{'<'}&nbsp;&nbsp;back</span>
      </BlackButton>
      {step !== 2 && (
        <BlackButton
          onClick={() => onClick(true)}
          isDisabled={
            (step === 0 && !chosenMarketKey) || (step === 1 && !pairType)
          }
        >
          <span>next&nbsp;&nbsp;{'>'}</span>
        </BlackButton>
      )}
    </div>
  );
};
