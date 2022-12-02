import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { web3 } from 'hadeswap-sdk';
import { PATHS } from '../../constants';
import Logo from '../../icons/Logo';
// import InfoBlock from './InfoBlock';
import CartBlock from './CartBlock';
import MenuList from './MenuList';
//import Search from '../Search';
import { ConnectWalletButton } from '../ConnectWalletButton/ConnectWalletButton';

import styles from './Header.module.scss';

export interface HeaderDesktopProps {
  connected: boolean;
  publicKey: web3.PublicKey;
  disconnect: () => void;
}

const HeaderDesktop: FC<HeaderDesktopProps> = ({
  connected,
  publicKey,
  disconnect,
}) => {
  return (
    <header className={styles.header}>
      {/*<InfoBlock />*/}
      <div className={styles.main}>
        <div className={styles.logoSearchWrapper}>
          <NavLink className={styles.logo} to={PATHS.ROOT}>
            <Logo />
          </NavLink>
          {/*<Search />*/}
        </div>
        <div className={styles.buttonsWrapper}>
          <MenuList classNames={styles} />
          <CartBlock />
          <ConnectWalletButton
            connected={connected}
            publicKey={publicKey}
            disconnect={disconnect}
          />
        </div>
      </div>
    </header>
  );
};

export default HeaderDesktop;
