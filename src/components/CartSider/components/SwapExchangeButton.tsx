import { FC, memo, useState } from 'react';
import Button from '../../Buttons/Button';
import { Spinner } from '../../Spinner/Spinner';
import { exchangeTokens } from '../../Jupiter/utils';
import { Tokens } from '../../../types';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

interface ExchangeButtonProps {
  solAmount: number;
  inputToken: Tokens;
  swap: () => Promise<void>;
}

const SwapExchangeButton: FC<ExchangeButtonProps> = ({ solAmount, inputToken, swap }) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const [loading, setLoading] = useState<boolean>(false);

  const swapHandler = async () => {
    setLoading(true);
    const swapResult = await exchangeTokens({ solAmount, inputToken, wallet, connection });
    console.log('EXCHANGE DONE');
    console.log('exchange Result', swapResult);
    setLoading(false);

    await swap();
    console.log('SWAP DONE');
  };

  return (
    <Button onClick={swapHandler} isDisabled={loading}>
      {loading ? <Spinner /> : <span>exchange swap</span>}
    </Button>
  );
};

export default memo(SwapExchangeButton);
