import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { PATHS } from '../../../constants';
import Logo from '../../../icons/Logo';
import { BurgerIcon } from '../../../icons/BurgerIcon';
import { CloseCrossIcon } from '../../../icons/CloseCrossIcon';
import Menu from './Menu';
import { ConnectWalletButton } from '../../ConnectWalletButton';
import styles from './Header.module.scss';
import RoundIconButton from '../../Buttons/RoundIconButton';
import { HomeIcon } from '../../../icons/HomeIcon';
import ButtonsBlock from '../ButtonsBlock';
import { selectScreeMode } from '../../../state/common/selectors';
import { ScreenTypes } from '../../../state/common/types';

const HeaderMobile: FC = () => {
  const [isMenuVisible, setMenuVisible] = useState<boolean>(false);
  const screenMode = useSelector(selectScreeMode);

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
        {screenMode !== ScreenTypes.TABLET && (
          <>
            <ButtonsBlock />
            <ConnectWalletButton />
          </>
        )}
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
