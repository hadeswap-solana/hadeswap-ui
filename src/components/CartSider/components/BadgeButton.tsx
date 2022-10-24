import { FC, memo } from 'react';
import { Badge, Button } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { commonActions } from '../../../state/common/actions';
import styles from '../CartSider.module.scss';

interface BadgeButtonProps {
  dispatch: (arg) => void;
  setShowModal?: (arg: (value) => boolean) => void;
  itemsAmount: number;
  className?: string;
}

const BadgeButton: FC<BadgeButtonProps> = ({
  dispatch,
  setShowModal = null,
  itemsAmount,
  className,
}) => (
  <Badge count={itemsAmount} className={className} offset={[-37, 3]}>
    <Button
      type="primary"
      icon={<ShoppingCartOutlined />}
      size={'large'}
      className={styles.badgeButton}
      onClick={() => {
        dispatch(commonActions.toggleCartSider());
        setShowModal && setShowModal((value) => !value);
      }}
    />
  </Badge>
);

export default memo(BadgeButton);
