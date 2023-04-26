import { FC, memo, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Button from '../../Buttons/Button';
import { Spinner } from '../../Spinner/Spinner';
import { useJupiterData } from '../../Jupiter/hook';
import { exchangeToken } from '../../Jupiter/utils';
import { TokenExchangeLoadingModal } from './TokenExchangeLoadingModal';
import { TokenItem } from '../../../constants/tokens';
import { formatNumericDigit, notify } from '../../../utils';
import { NotifyType } from '../../../utils/solanaUtils';
import JSBI from 'jsbi';

import styles from './styles.module.scss';

interface ExchangeButtonProps {
  inputToken: TokenItem;
  rate: number;
  amount: JSBI;
  tokenAmount: string;
  swap: () => Promise<void>;
  exchangeLoading: boolean;
  exchangeFetching: boolean;
}

const SwapExchangeButton: FC<ExchangeButtonProps> = ({
  inputToken,
  amount,
  tokenAmount,
  rate,
  swap,
  exchangeLoading,
  exchangeFetching,
}) => {
  const wallet = useWallet();
  const [txnLoading, setTxnLoading] = useState<boolean>(false);

  const { jupiter } = useJupiterData({ inputToken, amount });

  const estimatedSolAmount = (Number(tokenAmount) / rate).toFixed(3);
  const estimatedSolAmountFormatted = formatNumericDigit(estimatedSolAmount);
  const tokenFormattedAmount = formatNumericDigit(tokenAmount);

  const swapHandler = async () => {
    setTxnLoading(true);
    const exchangeResult = await exchangeToken({ jupiter, wallet });
    setTxnLoading(false);

    if (exchangeResult.error && exchangeResult.error.code !== 7001) {
      notify({
        message: exchangeResult.error.message,
        type: NotifyType.ERROR,
      });
    } else {
      notify({
        message: 'transaction successful!',
        type: NotifyType.SUCCESS,
      });
    }

    if (exchangeResult?.error && exchangeResult?.error?.code !== 7001) {
      return;
    } else {
      await swap();
    }
  };

  const loading = txnLoading || exchangeLoading || exchangeFetching;

  return (
    <>
      <Button onClick={swapHandler} isDisabled={loading || !wallet.connected}>
        {loading ? (
          <Spinner className={styles.exchangeButtonSpinner} />
        ) : (
          <span>swap exchange</span>
        )}
      </Button>
      {txnLoading && (
        <TokenExchangeLoadingModal
          solAmount={estimatedSolAmountFormatted}
          tokenAmount={tokenFormattedAmount}
          inputToken={inputToken}
        />
      )}
    </>
  );
};

export default memo(SwapExchangeButton);
