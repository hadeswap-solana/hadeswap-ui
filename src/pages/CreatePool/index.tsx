import { FC, useState } from 'react';
import { PairType } from 'hadeswap-sdk/lib/hadeswap-core/types';
import { useWallet } from '@solana/wallet-adapter-react';
import { Steps } from 'antd';
import { AppLayout } from '../../components/Layout/AppLayout';
import PageContentLayout from '../../components/Layout/PageContentLayout';
import { StepOne } from './components/StepOne';
import { StepTwo } from './components/StepTwo';
import { StepThree } from './components/StepThree';
import { StepsButtons } from './components/StepsButtons';

import styles from './styles.module.scss';

const { Step } = Steps;

export const CreatePool: FC = () => {
  const { connected } = useWallet();

  const [step, setStep] = useState<number>(0);
  const [chosenMarketKey, setChosenMarketKey] = useState<string>();
  const [pairType, setPairType] = useState<PairType>();

  return (
    <AppLayout>
      <PageContentLayout title="create pool">
        <>
          {!connected && (
            <h3 className={styles.h3}>connect your wallet for pool creation</h3>
          )}
          {connected && (
            <>
              <Steps current={step}>
                <Step title="select collection" />
                <Step title="select pool type" />
                <Step title="pool settings" />
              </Steps>
              <StepsButtons
                step={step}
                setStep={setStep}
                chosenMarketKey={chosenMarketKey}
                pairType={pairType}
              />
              <div className={styles.contentWrapper}>
                {step === 0 && (
                  <StepOne
                    setStep={setStep}
                    setChosenMarketKey={setChosenMarketKey}
                  />
                )}
                {step === 1 && (
                  <StepTwo
                    setStep={setStep}
                    pairType={pairType}
                    setPairType={setPairType}
                  />
                )}
                {step === 2 && (
                  <StepThree
                    pairType={pairType}
                    chosenMarketKey={chosenMarketKey}
                  />
                )}
              </div>
            </>
          )}
        </>
      </PageContentLayout>
    </AppLayout>
  );
};
