import { FC } from 'react';
import RoundIconButton from './RoundIconButton';
import { CartIcon } from '../../icons/CartIcon';

import styles from './styles.module.scss';

interface ButtonProps {
  btnClassName?: string;
  onClick: () => void;
  itemsAmount: number;
}

const BadgeButton: FC<ButtonProps> = ({
  btnClassName,
  onClick,
  itemsAmount,
}) => (
  <div className={styles.badgeButtonWrapper}>
    {!!itemsAmount && <div className={styles.badge}>{itemsAmount}</div>}
    <RoundIconButton className={btnClassName} onClick={onClick}>
      <CartIcon />
    </RoundIconButton>
  </div>
);

export default BadgeButton;
