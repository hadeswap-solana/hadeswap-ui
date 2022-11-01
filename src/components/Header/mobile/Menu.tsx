import { FC } from 'react';
import withModal from '../../Modal/mobile/Modal';
import MenuList from '../MenuList';
import styles from './Header.module.scss';

const Menu: FC = () => <MenuList classNames={styles} />;

export default withModal(Menu);
