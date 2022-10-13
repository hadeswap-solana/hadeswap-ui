import { useState } from "react";
import Logo from '../../../icons/Logo';
import { BurgerIcon } from "../../../icons/BurgerIcon";
import { CloseCrossIcon } from "../../../icons/CloseCrossIcon";
import Menu from "./Menu";
import { ConnectWalletButton } from "../../ConnectWalletButton/ConnectWalletButton";
import styles from './Header.module.scss';

const HeaderMobile = (): JSX.Element => {
  const [isMenuVisible, setMenuVisible] = useState<boolean>(false);

  return (
    <header className={styles.header}>
      <Logo className={styles.logo} />
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
      {isMenuVisible && <Menu />}
    </header>
  )
};

export default HeaderMobile;