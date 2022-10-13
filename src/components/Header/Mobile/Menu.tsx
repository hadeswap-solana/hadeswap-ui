import Modal from "../../Modal/Mobile/Modal";
import MenuList from "../MenuList";
import styles from "./Header.module.scss";

const Menu = () => (
  <Modal className={styles.modalMenu}>
    <MenuList styles={styles} />
  </Modal>
);

export default Menu;