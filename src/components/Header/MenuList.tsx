import { FC } from 'react';
import { NavLink } from "react-router-dom";
import { PATHS } from "../../constants";

interface MenuListProps {
  styles: {
    nav?: string;
    navLink?: string;
    navLinkActive?: string;
  }
}

const MenuList: FC<MenuListProps> = (
  { styles: { nav = null, navLink = null, navLinkActive = null } }
): JSX.Element => (
  <nav className={nav}>
    <NavLink
      to={PATHS.COLLECTIONS}
      className={navLink}
      activeClassName={navLinkActive}
    >
      collections
    </NavLink>
    <NavLink
      to={PATHS.MY_POOLS}
      className={navLink}
      activeClassName={navLinkActive}
    >
      my pools
    </NavLink>
  </nav>
);

export default MenuList;