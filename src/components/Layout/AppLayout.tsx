import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Layout, Menu } from 'antd';

import { commonActions } from '../../state/common/actions';
import { ConnectWalletButton } from '../ConnectWalletButton/ConnectWalletButton';
import { SelectWalletModal } from '../SelectWalletModal/SelectWalletModal';
import styles from './AppLayout.module.scss';
import classNames from 'classnames';

const { Header, Content, Footer } = Layout;

interface LayoutProps {
  customHeader?: JSX.Element;
  children: JSX.Element[] | JSX.Element;
  className?: string;
  contentClassName?: string;
}

export const AppLayout: FC<LayoutProps> = ({
  children,
  className = '',
  contentClassName = '',
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(commonActions.setWalletModal({ isVisible: false }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <Layout className={className}>
      <Header className={styles.header}>
        <div className={styles.logo}>Logo</div>
        <Menu
          theme="dark"
          mode="horizontal"
          items={[
            {
              key: '0',
              label: 'Collections',
            },
            {
              key: '1',
              label: 'My Pools',
            },
            {
              key: '2',
              label: 'My NFTs',
            },
          ]}
        />
        <div
          className={classNames(
            styles.connectWalletContainer,
            contentClassName,
          )}
        >
          <ConnectWalletButton />
        </div>
      </Header>
      <Content className={styles.content}>{children}</Content>
      <Footer className={styles.footer}>Footer?</Footer>
      <SelectWalletModal />
    </Layout>
  );
};
