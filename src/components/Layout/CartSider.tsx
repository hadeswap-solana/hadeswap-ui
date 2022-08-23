import { FC } from 'react';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Badge, Button, Layout, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { selectCartSiderVisible } from '../../state/common/selectors';
import { commonActions } from '../../state/common/actions';
import styles from './AppLayout.module.scss';

const { Sider } = Layout;
const { Text } = Typography;

export const CartSider: FC = () => {
  const dispatch = useDispatch();
  const visible = useSelector(selectCartSiderVisible);

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={!visible}
      className={styles.cartSider}
      collapsedWidth={0}
      width={320}
    >
      <Badge count={5} className={styles.toggleCartSiderBtn} offset={[-40, 0]}>
        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          size={'large'}
          onClick={() => dispatch(commonActions.toggleCartSider())}
        />
      </Badge>
      <Text>Cart items here</Text>
    </Sider>
  );
};
