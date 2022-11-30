import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Layout as AntdLayout, Typography } from 'antd';
import classNames from 'classnames';
import { commonActions } from '../../state/common/actions';
import { SelectWalletModal } from '../SelectWalletModal/SelectWalletModal';
import Header from '../Header';
import CartSider from '../CartSider';
import { TransactionsLoadingModal } from '../TransactionsLoadingModal';
import DocsIcon from '../../icons/DocsIcon';
import DiscordSquareIcon from '../../icons/DiscordSquareIcon';
import TwitterSquareIcon from '../../icons/TwitterSquareIcon';
import styles from './AppLayout.module.scss';

const { Footer } = AntdLayout;

interface LayoutProps {
  customHeader?: JSX.Element;
  children: JSX.Element[] | JSX.Element;
  className?: string;
  contentClassName?: string;
  hideFooter?: boolean;
}

const DOCS_LIST = [{ to: 'https://docs.hadeswap.com/', icon: DocsIcon }];

const SOCIALS_LIST = [
  { to: 'https://discord.gg/hadeswap', icon: DiscordSquareIcon },
  { to: 'https://twitter.com/hadeswap', icon: TwitterSquareIcon },
  // { to: 'https://github.com/frakt-solana', icon: GitHubIcon },
];

export const AppLayout: FC<LayoutProps> = ({
  children,
  hideFooter = true,
  contentClassName = '',
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(commonActions.setWalletModal({ isVisible: false }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <>
      <div className={styles.layoutWrapper}>
        <Header />
        <div className={styles.content}>
          <div className={styles.mainWrapper}>
            <main className={classNames(styles.main, contentClassName)}>
              {children}
            </main>
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
                  hadeswap is currently not audited and will be open sourced
                  soon after the audit is conducted. use at your own risk.
                </div>
              </Footer>
            )}
          </div>
          <CartSider />
        </div>
      </div>
      <SelectWalletModal />
      <TransactionsLoadingModal />
    </>
  );
};
