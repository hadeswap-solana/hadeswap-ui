import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Layout } from 'antd';

import { commonActions } from '../../state/common/actions';
import { ConnectWalletButton } from '../ConnectWalletButton/ConnectWalletButton';
import { SelectWalletModal } from '../SelectWalletModal/SelectWalletModal';
import styles from './AppLayout.module.scss';
import { NavLink } from 'react-router-dom';
import { PATHS } from '../../constants';
import { CartSider } from './CartSider';
import { TransactionsLoadingModal } from '../TransactionsLoadingModal';

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
  // contentClassName = '',
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(commonActions.setWalletModal({ isVisible: false }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <Layout className={className}>
      <Layout>
        <Header className={styles.header}>
          <NavLink className={styles.logo} to={PATHS.ROOT}>
            Hadeswap
          </NavLink>
          <nav className={styles.nav}>
            <NavLink
              to={PATHS.COLLECTIONS}
              className={styles.navLink}
              activeClassName={styles.navLinkActive}
            >
              Collections
            </NavLink>
            <div className={styles.navRight}>
              <NavLink
                to={PATHS.MY_POOLS}
                className={styles.navLink}
                activeClassName={styles.navLinkActive}
              >
                My Pools
              </NavLink>
              {/* <NavLink
                to={PATHS.MY_NFTS}
                className={styles.navLink}
                activeClassName={styles.navLinkActive}
              >
                My NFTs
              </NavLink> */}
              <ConnectWalletButton className={styles.connectBtn} />
            </div>
          </nav>
        </Header>
        <Content className={styles.content}>{children}</Content>
        <Footer className={styles.footer}>Footer?</Footer>
      </Layout>
      <CartSider />
      <SelectWalletModal />
      <TransactionsLoadingModal />
    </Layout>
  );
};
