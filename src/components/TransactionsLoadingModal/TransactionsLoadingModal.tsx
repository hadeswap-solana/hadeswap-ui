import { Modal, Typography } from 'antd';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { Spinner } from '../Spinner/Spinner';
import styles from './TransactionsLoadingModal.module.scss';
import { selectTxsLoadingModalState } from '../../state/txsLoadingModal/selectors';
import { TxsLoadingModalTextStatus } from '../../state/txsLoadingModal/reducers';

const TEXTS = {
  approve: 'Please, approve it in your wallet',
  waiting: 'Waiting for finalization',
};

export const TransactionsLoadingModal: FC = () => {
  const state = useSelector(selectTxsLoadingModalState);

  return (
    <Modal visible={state.visible} footer={null} centered closable={false}>
      <div className={styles.content}>
        <Spinner />
        <Typography.Title level={3} style={{ marginTop: 32, marginBottom: 0 }}>
          Sending transaction ({state.currentTxNumber} / {state.amountOfTxs})
        </Typography.Title>
        <Typography.Text>
          {state.textStatus === TxsLoadingModalTextStatus.APPROVE
            ? TEXTS.approve
            : TEXTS.waiting}
        </Typography.Text>
        <Typography.Title level={5}>Transaction instructions:</Typography.Title>
        <div className={styles.ordersContainer}>
          {state.cards.map((card) => card)}
        </div>
      </div>
    </Modal>
  );
};
