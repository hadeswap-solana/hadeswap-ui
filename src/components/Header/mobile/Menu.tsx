import { FC } from 'react';
import Modal from '../../Modal/mobile/Modal';
import MenuList from '../MenuList';
import styles from './Header.module.scss';

const Menu: FC = () => (
  <Modal className={styles.modalMenu}>
    <MenuList classNames={styles} />
  </Modal>
);

export default Menu;
