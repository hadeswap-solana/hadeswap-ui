import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { PairType } from 'hadeswap-sdk/lib/hadeswap-core/types';
import { useWallet } from '@solana/wallet-adapter-react';
import { Steps } from 'antd';
import { AppLayout } from '../../components/Layout/AppLayout';
import PageContentLayout from '../../components/Layout/PageContentLayout';
import { StepOne } from './components/StepOne';
import { StepTwo } from './components/StepTwo';
import { StepThree } from './components/StepThree';
import { StepsButtons } from './components/StepsButtons';
import { useFetchMarket } from '../../requests';
import {
  selectCertainMarket,
  selectCertainMarketLoading,
} from '../../state/core/selectors';
import styles from './styles.module.scss';

const { Step } = Steps;

export const CreatePool: FC = () => {
  const { connected } = useWallet();
  const market = useSelector(selectCertainMarket);
  const marketLoading = useSelector(selectCertainMarketLoading);

  const [step, setStep] = useState<number>(market.marketPubkey ? 1 : 0);
  const [chosenMarketKey, setChosenMarketKey] = useState<string>(
    market.marketPubkey,
  );
  const [pairType, setPairType] = useState<PairType>();

  useFetchMarket(chosenMarketKey);

  return (
    <AppLayout>
      <PageContentLayout title="create pool">
        <>
          {!connected && (
            <h2 className={styles.h2}>connect your wallet for pool creation</h2>
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
                    market={market}
                    marketLoading={marketLoading}
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
