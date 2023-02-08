import { FC, memo, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Button from '../../Buttons/Button';
import { Spinner } from '../../Spinner/Spinner';
import { useJupiterData } from '../../Jupiter/hook';
import { exchangeToken } from '../../Jupiter/utils';
import { TokenExchangeLoadingModal } from './TokenExchangeLoadingModal';
import { TokenItem } from '../../../constants/tokens';
import { formatBNToString, notify } from '../../../utils';
import { BN } from 'hadeswap-sdk';
import { NotifyType } from '../../../utils/solanaUtils';
import JSBI from 'jsbi';

import styles from './styles.module.scss';

interface ExchangeButtonProps {
  rawSolAmount: number;
  inputToken: TokenItem;
  amount: JSBI;
  tokenFormattedAmount: string;
  swap: () => Promise<void>;
  exchangeLoading: boolean;
  exchangeFetching: boolean;
}

const SwapExchangeButton: FC<ExchangeButtonProps> = ({
  rawSolAmount,
  inputToken,
  amount,
  tokenFormattedAmount,
  swap,
  exchangeLoading,
  exchangeFetching,
}) => {
  const wallet = useWallet();
  const [txnLoading, setTxnLoading] = useState<boolean>(false);

  const { jupiter } = useJupiterData({ inputToken, amount });

  const solFormattedAmount = formatBNToString(new BN(rawSolAmount), 9, 3);

  const swapHandler = async () => {
    setTxnLoading(true);
    const exchangeResult = await exchangeToken({ jupiter, wallet });
    setTxnLoading(false);

    if (exchangeResult.error) {
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

    !exchangeResult.error && (await swap());
  };

  const loading = txnLoading || exchangeLoading || exchangeFetching;

  return (
    <>
      <Button onClick={swapHandler} isDisabled={loading || !wallet.connected}>
        {loading ? (
          <Spinner className={styles.exchangeButtonSpinner} />
        ) : (
          <span>swap</span>
        )}
      </Button>
      {txnLoading && (
        <TokenExchangeLoadingModal
          solAmount={solFormattedAmount}
          tokenAmount={tokenFormattedAmount}
          inputToken={inputToken}
        />
      )}
    </>
  );
};

export default memo(SwapExchangeButton);
