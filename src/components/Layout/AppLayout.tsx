import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';

import Header from '../Header';
import CartSider from '../CartSider';
import { Footer } from '../Footer';
import { SelectWalletModal } from '../SelectWalletModal/SelectWalletModal';
import { TransactionsLoadingModal } from '../TransactionsLoadingModal';
import { commonActions } from '../../state/common/actions';

import styles from './AppLayout.module.scss';

interface LayoutProps {
  customHeader?: JSX.Element;
  children: JSX.Element[] | JSX.Element;
  className?: string;
  contentClassName?: string;
  hideFooter?: boolean;
}

export const AppLayout: FC<LayoutProps> = ({
  children,
  hideFooter = true,
  contentClassName = '',
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(commonActions.setWalletModal({ isVisible: false }));
  }, [dispatch]);

  return (
    <>
      <div className={styles.layoutWrapper}>
        <Header />
        <div className={styles.content}>
          <div className={styles.mainWrapper}>
            <main className={classNames(styles.main, contentClassName)}>
              {children}
            </main>
            {!hideFooter && <Footer />}
          </div>
          <CartSider />
        </div>
      </div>
      <SelectWalletModal />
      <TransactionsLoadingModal />
    </>
  );
};
