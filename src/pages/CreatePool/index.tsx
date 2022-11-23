import { FC, useState } from 'react';
import { Steps } from 'antd';
import { AppLayout } from '../../components/Layout/AppLayout';
import PageContentLayout from '../../components/Layout/PageContentLayout';
import { StepOne } from './components/StepOne';
import { StepTwo } from './components/StepTwo';
import { StepThree } from './components/StepThree';
import { PairType } from 'hadeswap-sdk/lib/hadeswap-core/types';

import styles from './styles.module.scss';

const { Step } = Steps;

export const CreatePool: FC = () => {
  const [step, setStep] = useState<number>(0);
  const [chosenMarketKey, setChosenMarketKey] = useState<string>();
  const [pairType, setPairType] = useState<PairType>();

  return (
    <AppLayout>
      <PageContentLayout title="create pool">
        <Steps current={step}>
          <Step title="select collection" />
          <Step title="select pool type" />
          <Step title="pool settings" />
        </Steps>
        <div className={styles.contentWrapper}>
          {step === 0 && (
            <StepOne
              setStep={setStep}
              setChosenMarketKey={setChosenMarketKey}
            />
          )}
          {step === 1 && (
            <StepTwo setStep={setStep} setPairType={setPairType} />
          )}
          {step === 2 && (
            <StepThree pairType={pairType} chosenMarketKey={chosenMarketKey} />
          )}
        </div>
      </PageContentLayout>
    </AppLayout>
  );
};
