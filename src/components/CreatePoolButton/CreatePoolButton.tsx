import { FC, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import classNames from 'classnames';

import Button from '../Buttons/Button';
import { createCreatePoolPickSideLink } from '../../constants';
import styles from './CreatePoolButton.module.scss';

interface CreatePoolButtonProps {
  className?: string;
}

export const CreatePoolButton: FC<CreatePoolButtonProps> = ({ className }) => {
  const history = useHistory();
  const { publicKey: marketPublicKey } = useParams<{ publicKey: string }>();

  const onCreatePoolClick = useCallback(() => {
    marketPublicKey
      ? history.push(createCreatePoolPickSideLink(marketPublicKey))
      : history.push('/create-pool');
  }, [history, marketPublicKey]);

  return (
    <Button
      className={classNames(styles.poolButton, className)}
      onClick={onCreatePoolClick}
    >
      <span>create pool</span>
    </Button>
  );
};
