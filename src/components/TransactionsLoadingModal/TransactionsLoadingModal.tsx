import { Modal, Typography } from 'antd';
import { FC, Fragment } from 'react';
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
        <Typography.Title level={3} style={{ marginTop: 8, marginBottom: 0 }}>
          {state.currentTxNumber
            ? `Sending transaction ${state.currentTxNumber} / ${state.amountOfTxs}`
            : `Sending transactions: ${state.amountOfTxs}`}
        </Typography.Title>
        <Typography.Text>
          {state.textStatus === TxsLoadingModalTextStatus.APPROVE
            ? TEXTS.approve
            : TEXTS.waiting}
        </Typography.Text>
        {Boolean(state.cards.length) && (
          <>
            <Typography.Title level={5}>
              Transaction instructions:
            </Typography.Title>
            <div className={styles.ordersContainer}>
              {state.cards.map((card, idx) => (
                <Fragment key={idx}>{card}</Fragment>
              ))}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
