import { FC } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import classNames from 'classnames';

import Button from '../Buttons/Button';
import styles from './CreatePoolButton.module.scss';

interface CreatePoolButtonProps {
  className?: string;
}

export const CreatePoolButton: FC<CreatePoolButtonProps> = ({ className }) => {
  const { publicKey: marketPublicKey } = useParams<{ publicKey: string }>();

  return (
    <NavLink to={`/create-pool/${marketPublicKey || ''}`}>
      <Button className={classNames(styles.poolButton, className)}>
        <span>create pool</span>
      </Button>
    </NavLink>
  );
};
