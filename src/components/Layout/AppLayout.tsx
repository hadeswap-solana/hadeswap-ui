import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Typography } from 'antd';
import classNames from 'classnames';
import { throttle } from 'lodash';

import { commonActions } from '../../state/common/actions';
import { selectCartSiderVisible } from '../../state/common/selectors';
import { SelectWalletModal } from '../SelectWalletModal/SelectWalletModal';
import Header from '../Header';
import { CartSider } from './CartSider';
import { TransactionsLoadingModal } from '../TransactionsLoadingModal';
// import MediumIcon from '../../icons/MediumIcon';
import DocsIcon from '../../icons/DocsIcon';
import DiscordIcon from '../../icons/DiscordIcon';
import TwitterIcon from '../../icons/TwitterIcon';
// import GitHubIcon from '../../icons/GitHubIcon';
import { DESKTOP_SIZE } from "../../constants/common";
import styles from './AppLayout.module.scss';

const { Content, Footer } = Layout;

interface LayoutProps {
  customHeader?: JSX.Element;
  children: JSX.Element[] | JSX.Element;
  className?: string;
  contentClassName?: string;
  hideFooter?: boolean;
}
console.log('n');
const DOCS_LIST = [{ to: 'https://docs.hadeswap.com/', icon: DocsIcon }];

const SOCIALS_LIST = [
  { to: 'https://discord.gg/hadeswap', icon: DiscordIcon },
  { to: 'https://twitter.com/hadeswap', icon: TwitterIcon },
  // { to: 'https://github.com/frakt-solana', icon: GitHubIcon },
];

export const AppLayout: FC<LayoutProps> = ({
  children,
  className = '',
  hideFooter = false,
  contentClassName = '',
}) => {
  const dispatch = useDispatch();
  const cartSiderOpened = useSelector(selectCartSiderVisible);

  const setMobileMode = () => {
    if (window.screen.width < DESKTOP_SIZE) {
      dispatch(commonActions.toggleMobileMode(true));
    } else {
      dispatch(commonActions.toggleMobileMode(false));
    }
  };

  useEffect(() => {
    setMobileMode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const resizeThrottled = throttle(setMobileMode, 300);
    window.addEventListener('resize', resizeThrottled);
    return () => window.removeEventListener('resize', resizeThrottled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <Header />
        <Content className={classNames(styles.content, contentClassName)}>
          {children}
        </Content>
        {!hideFooter && (
          <Footer>
            <div className={styles.footerSocial}>
              <div className={styles.footerSocialBlock}>
                <Typography.Text>documentation</Typography.Text>
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
              <div className={styles.footerSocialBlock}>
                <Typography.Text>contact us</Typography.Text>
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
            </div>
            <div className={styles.footerDisclaimer}>
              hadeswap is currently not audited and will be open sourced soon
              after the audit is conducted. use at your own risk.
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
