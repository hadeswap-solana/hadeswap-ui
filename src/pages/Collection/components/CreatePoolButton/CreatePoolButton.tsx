import { FC, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';

import { createCreatePoolPickSideLink } from '../../../../constants';
import Button from '../../../../components/Buttons/Button';
import styles from './CreatePoolButton.module.scss';

interface CreatePoolButtonProps {
  marketPublicKey: string;
  className?: string;
}

export const CreatePoolButton: FC<CreatePoolButtonProps> = ({
  marketPublicKey,
  className,
}) => {
  const history = useHistory();

  const onCreatePoolClick = useCallback(() => {
    history.push(createCreatePoolPickSideLink(marketPublicKey));
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

export default CreatePoolButton;
