import { FC } from 'react';
import { Modal } from 'antd';
import { Spinner } from '../../Spinner/Spinner';
import { IxCard } from '../../TransactionsLoadingModal/components';
import { TokenItem } from '../../../constants/tokens';
import { SolanaLogo } from '../../../icons/SolanaLogo';

import styles from './styles.module.scss';

interface TokenExchangeLoadingModalProps {
  solAmount: string;
  tokenAmount: string;
  inputToken: TokenItem;
}

export const TokenExchangeLoadingModal: FC<TokenExchangeLoadingModalProps> = ({
  solAmount,
  tokenAmount,
  inputToken,
}) => {
  return (
    <Modal visible={true} footer={null} centered closable={false}>
      <div className={styles.tokenExchangeLoadingModal}>
        <Spinner />
        <h3 className={styles.title}>exchange tokens</h3>
        <IxCard className={styles.card}>
          <img
            className={styles.cardImage}
            src={inputToken.image}
            alt={inputToken.label}
          />
          <div className={styles.cardTextWrapper}>
            <span>
              <strong>{tokenAmount}</strong>
            </span>
            {'to'}
            <span>
              <strong>{solAmount}</strong>
            </span>
          </div>
          <SolanaLogo className={styles.solanaLogo} />
        </IxCard>
      </div>
    </Modal>
  );
};
