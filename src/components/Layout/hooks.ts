import { useSelector } from 'react-redux';
import { selectCartOrders, selectCartPairs } from '../../state/core/selectors';
import { chunk } from 'lodash';
import { useConnection } from '../../hooks';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  createIx,
  mergeIxsIntoTxn,
  signAndSendTransactionsInSeries,
} from './helpers';

type UseSwap = () => {
  swap: () => Promise<void>;
};

export const useSwap: UseSwap = () => {
  const IX_PER_TXN = 3;

  const connection = useConnection();
  const wallet = useWallet();

  const orders = useSelector(selectCartOrders);
  const pairs = useSelector(selectCartPairs);

  const swap = async () => {
    const ordersArray = Object.values(orders).flat();

    const ixsAndSigners = await Promise.all(
      ordersArray.map((order) =>
        createIx({
          connection,
          walletPubkey: wallet.publicKey,
          pair: pairs[order.targetPairPukey],
          order,
        }),
      ),
    );

    const ixsAndSignersChunks = chunk(ixsAndSigners, IX_PER_TXN);

    const txnAndSigners = ixsAndSignersChunks.map((ixsAndSigners) =>
      mergeIxsIntoTxn(ixsAndSigners),
    );

    await signAndSendTransactionsInSeries({
      txnAndSigners,
      connection,
      wallet,
    });
  };

  return {
    swap,
  };
};
