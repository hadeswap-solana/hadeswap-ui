import { FC, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { web3 } from 'hadeswap-sdk';
import { PATHS } from '../../../constants';
import Logo from '../../../icons/Logo';
import { BurgerIcon } from '../../../icons/BurgerIcon';
import { CloseCrossIcon } from '../../../icons/CloseCrossIcon';
import Menu from './Menu';
import { ConnectWalletButton } from '../../ConnectWalletButton/ConnectWalletButton';
import styles from './Header.module.scss';

export interface HeaderMobileProps {
  connected: boolean;
  publicKey: web3.PublicKey;
  disconnect: () => void;
}

const HeaderMobile: FC<HeaderMobileProps> = ({
  connected,
  publicKey,
  disconnect,
}) => {
  const [isMenuVisible, setMenuVisible] = useState<boolean>(false);

  return (
    <header className={styles.header}>
      <NavLink className={styles.logoLink} to={PATHS.ROOT}>
        <Logo className={styles.logoIcon} />
      </NavLink>
      <div className={styles.buttonsWrapper}>
        <ConnectWalletButton
          connected={connected}
          publicKey={publicKey}
          disconnect={disconnect}
        />
        <div
          className={styles.menuBtnWrapper}
          onClick={() => setMenuVisible(!isMenuVisible)}
        >
          {!isMenuVisible && <BurgerIcon />}
          {isMenuVisible && <CloseCrossIcon />}
        </div>
      </div>
      {isMenuVisible && <Menu modalClassName={styles.modalMenu} />}
    </header>
  );
};

export default HeaderMobile;
