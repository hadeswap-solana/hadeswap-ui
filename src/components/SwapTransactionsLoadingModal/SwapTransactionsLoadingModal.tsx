import { Modal, Typography } from 'antd';
import { BN } from 'hadeswap-sdk';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { OrderType } from '../../state/core/types';
import { formatBNToString } from '../../utils';
import { Spinner } from '../Spinner/Spinner';
import styles from './SwapTransactionsLoadingModal.module.scss';
import solanaLogo from '../../assets/icons/svg/solana-sol-logo.svg';
import { selectSwapTxsLoadingModalState } from '../../state/swapTxsLoadingModal/selectors';
import { SwapTxsLoadingModalTextStatus } from '../../state/swapTxsLoadingModal/reducers';

const TEXTS = {
  approve: 'Please, approve it in your wallet',
  waiting: 'Waiting for finalization',
};

export const SwapTransactionsLoadingModal: FC = () => {
  const state = useSelector(selectSwapTxsLoadingModalState);

  return (
    <Modal visible={state.visible} footer={null} centered closable={false}>
      <div className={styles.content}>
        <Spinner />
        <Typography.Title level={3} style={{ marginTop: 32, marginBottom: 0 }}>
          Sending transaction ({state.currentTxNumber} / {state.amountOfTxs})
        </Typography.Title>
        <Typography.Text>
          {state.textStatus === SwapTxsLoadingModalTextStatus.APPROVE
            ? TEXTS.approve
            : TEXTS.waiting}
        </Typography.Text>
        <Typography.Title level={5}>Transaction instructions:</Typography.Title>
        <div className={styles.ordersContainer}>
          {Object.values(state.ordersInTx)
            .flat()
            .map(({ name, imageUrl, type, mint, price }) => (
              <div className={styles.card} key={mint}>
                <img className={styles.cardImage} src={imageUrl} alt={name} />
                <Typography.Text className={styles.cardText}>
                  {type === OrderType.BUY ? 'Buying ' : 'Selling '}
                  <strong>{name}</strong>
                  {' for '}
                  <span className={styles.cardPrice}>
                    <img width={16} height={16} src={solanaLogo} />{' '}
                    {formatBNToString(new BN(price))}
                  </span>
                </Typography.Text>
              </div>
            ))}
        </div>
      </div>
    </Modal>
  );
};
