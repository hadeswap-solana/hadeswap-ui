import { NavLink } from "react-router-dom";
import { PATHS } from "../../constants";
import Logo from "../../icons/Logo";
import MenuList from "./MenuList";
import { ConnectWalletButton } from "../ConnectWalletButton/ConnectWalletButton";
import { Layout } from "antd";

import styles from './Header.module.scss';

const { Header } = Layout;

const HeaderDesktop = (): JSX.Element => (
  <Header className={styles.header}>
    <NavLink className={styles.logo} to={PATHS.ROOT}>
      <Logo />
    </NavLink>
    <div className={styles.buttonsWrapper}>
      <MenuList styles={styles} />
      <ConnectWalletButton className={styles.connectBtn} />
    </div>
  </Header>
);

export default HeaderDesktop;
