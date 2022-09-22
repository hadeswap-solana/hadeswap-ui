import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Typography } from 'antd';

import { commonActions } from '../../state/common/actions';
import { ConnectWalletButton } from '../ConnectWalletButton/ConnectWalletButton';
import { SelectWalletModal } from '../SelectWalletModal/SelectWalletModal';
import styles from './AppLayout.module.scss';
import { NavLink } from 'react-router-dom';
import { PATHS } from '../../constants';
import { CartSider } from './CartSider';
import { TransactionsLoadingModal } from '../TransactionsLoadingModal';
import Logo from '../../icons/Logo';
import MediumIcon from '../../icons/MediumIcon';
import DocsIcon from '../../icons/DocsIcon';
import DiscordIcon from '../../icons/DiscordIcon';
import TwitterIcon from '../../icons/TwitterIcon';
import GitHubIcon from '../../icons/GitHubIcon';
import classNames from 'classnames';
import { selectCartSiderVisible } from '../../state/common/selectors';

const { Header, Content, Footer } = Layout;

interface LayoutProps {
  customHeader?: JSX.Element;
  children: JSX.Element[] | JSX.Element;
  className?: string;
  contentClassName?: string;
  hideFooter?: boolean;
}

const DOCS_LIST = [
  { to: 'https://medium.com/@frakt_HQ', icon: MediumIcon },
  { to: 'https://docs.frakt.xyz/', icon: DocsIcon },
];

const SOCIALS_LIST = [
  { to: 'https://tinyurl.com/zp3rx6z3', icon: DiscordIcon },
  { to: 'https://twitter.com/FRAKT_HQ', icon: TwitterIcon },
  { to: 'https://github.com/frakt-solana', icon: GitHubIcon },
];

export const AppLayout: FC<LayoutProps> = ({
  children,
  className = '',
  hideFooter = false,
  contentClassName = '',
}) => {
  const dispatch = useDispatch();
  const cartSiderOpened = useSelector(selectCartSiderVisible);

  useEffect(() => {
    dispatch(commonActions.setWalletModal({ isVisible: false }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <Layout className={className}>
      <div
        className={classNames(styles.main, {
          [styles.mainAndSiderOpened]: cartSiderOpened,
        })}
      >
        <Header className={styles.header}>
          <NavLink className={styles.logo} to={PATHS.ROOT}>
            <Logo />
          </NavLink>
          <nav className={styles.nav}>
            <div></div>
            <div className={styles.navRight}>
              <NavLink
                to={PATHS.COLLECTIONS}
                className={styles.navLink}
                activeClassName={styles.navLinkActive}
              >
                Collections
              </NavLink>
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
        <Content className={classNames(styles.content, contentClassName)}>
          {children}
        </Content>
        {!hideFooter && (
          <Footer className={styles.footer}>
            <div className={styles.footerBlock}>
              <Typography.Text>Documentation</Typography.Text>
              <ul className={styles.socialNavs}>
                {DOCS_LIST.map(({ to, icon: Icon }, idx) => (
                  <li className={styles.socialItem} key={idx}>
                    <a href={to} target="_blank" rel="noreferrer">
                      <Icon />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.footerBlock}>
              <Typography.Text>Contact us</Typography.Text>
              <ul className={styles.socialNavs}>
                {SOCIALS_LIST.map(({ to, icon: Icon }, idx) => (
                  <li className={styles.socialItem} key={idx}>
                    <a href={to} target="_blank" rel="noreferrer">
                      <Icon />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Footer>
        )}
      </div>
      <CartSider />
      <SelectWalletModal />
      <TransactionsLoadingModal />
    </Layout>
  );
};
