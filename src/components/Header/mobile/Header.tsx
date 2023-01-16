import { FC, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { PATHS } from '../../../constants';
import Logo from '../../../icons/Logo';
import { BurgerIcon } from '../../../icons/BurgerIcon';
import { CloseCrossIcon } from '../../../icons/CloseCrossIcon';
import Menu from './Menu';
import { ConnectWalletButton } from '../../ConnectWalletButton/ConnectWalletButton';
import styles from './Header.module.scss';
import RoundIconButton from '../../Buttons/RoundIconButton';
import { HomeIcon } from '../../../icons/HomeIcon';

const HeaderMobile: FC = () => {
  const [isMenuVisible, setMenuVisible] = useState<boolean>(false);

  return (
    <header className={styles.header}>
      <div className={styles.logoWrapper}>
        <NavLink className={styles.logoLink} to={PATHS.ROOT}>
          <Logo className={styles.logoIcon} />
        </NavLink>
        <RoundIconButton className={styles.homeButton}>
          <a href="https://www.hadeswap.com/">
            <HomeIcon />
          </a>
        </RoundIconButton>
      </div>
      <div className={styles.buttonsWrapper}>
        <ConnectWalletButton />
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
