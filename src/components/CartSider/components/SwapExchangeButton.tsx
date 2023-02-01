import { FC, memo, useState } from 'react';
import Button from '../../Buttons/Button';
import { Spinner } from '../../Spinner/Spinner';
import { useExchangeData } from '../../Jupiter/hook';
import { exchangeToken } from '../../Jupiter/utils';
import { Tokens } from '../../../types';
import { useWallet } from '@solana/wallet-adapter-react';

interface ExchangeButtonProps {
  rawSolAmount: number;
  inputToken: Tokens;
  swap: () => Promise<void>;
}

const SwapExchangeButton: FC<ExchangeButtonProps> = ({
  rawSolAmount,
  inputToken,
  swap,
}) => {
  const wallet = useWallet();

  const [loading, setLoading] = useState<boolean>(false);

  const { jupiter, isLoading, isFetching } = useExchangeData({
    rawSolAmount,
    inputToken,
  });

  const swapHandler = async () => {
    setLoading(true);
    await exchangeToken({ jupiter, wallet });
    await swap();
    setLoading(false);
  };

  return (
    <Button onClick={swapHandler} isDisabled={loading}>
      {loading || isFetching || isLoading ? <Spinner /> : <span>swap</span>}
    </Button>
  );
};

export default memo(SwapExchangeButton);
