import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import Header from '../Header';
import CartSider from '../CartSider';
import { Footer } from '../Footer';
import { SelectWalletModal } from '../SelectWalletModal/SelectWalletModal';
import { TransactionsLoadingModal } from '../TransactionsLoadingModal';
import { useCartSider } from '../CartSider/hooks';
import { commonActions } from '../../state/common/actions';
import { selectScreeMode } from '../../state/common/selectors';
import { ScreenTypes } from '../../state/common/types';

import styles from './AppLayout.module.scss';

interface LayoutProps {
  children: JSX.Element[] | JSX.Element;
  hideFooter?: boolean;
}

export const AppLayout: FC<LayoutProps> = ({ children, hideFooter = true }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(commonActions.setWalletModal({ isVisible: false }));
  }, [dispatch]);

  const { isCartEmpty } = useCartSider();
  const screenMode = useSelector(selectScreeMode);
  const notDesktop = screenMode !== ScreenTypes.DESKTOP;
  const cartSiderMobileLayout = notDesktop && !isCartEmpty;

  return (
    <>
      <div className={styles.layoutWrapper}>
        <Header />
        <div className={styles.content}>
          <div
            className={classNames(styles.mainWrapper, {
              [styles.cartHasItems]: cartSiderMobileLayout,
            })}
          >
            <main>{children}</main>
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
