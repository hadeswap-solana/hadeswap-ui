import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { PATHS } from '../../constants';
import Logo from '../../icons/Logo';
import { HomeIcon } from '../../icons/HomeIcon';
import RoundIconButton from '../Buttons/RoundIconButton';
// import InfoBlock from './InfoBlock';
import CartBlock from './CartBlock';
import MenuList from './MenuList';
//import Search from '../Search';
import { ConnectWalletButton } from '../ConnectWalletButton/ConnectWalletButton';

import styles from './Header.module.scss';

const HeaderDesktop: FC = () => (
  <header className={styles.header}>
    {/*<InfoBlock />*/}
    <div className={styles.main}>
      <div className={styles.logoSearchWrapper}>
        <NavLink className={styles.logo} to={PATHS.ROOT}>
          <Logo />
        </NavLink>
        <RoundIconButton className={styles.homeButton}>
          <a href="https://www.hadeswap.com/">
            <HomeIcon />
          </a>
        </RoundIconButton>
        {/*<Search />*/}
      </div>
      <div className={styles.buttonsWrapper}>
        <MenuList classNames={styles} />
        <CartBlock />
        <ConnectWalletButton />
      </div>
    </div>
  </header>
);

export default HeaderDesktop;
