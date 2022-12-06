import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

import Button from '../Buttons/Button';
import styles from './CreatePoolButton.module.scss';

interface CreatePoolButtonProps {
  className?: string;
}

export const CreatePoolButton: FC<CreatePoolButtonProps> = ({ className }) => {
  return (
    <Button className={classNames(styles.poolButton, className)}>
      <NavLink to="/create-pool">
        <span>create pool</span>
      </NavLink>
    </Button>
  );
};
