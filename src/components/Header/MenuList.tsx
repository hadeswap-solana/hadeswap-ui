import { FC } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { PATHS } from '../../constants';
import { selectScreeMode } from '../../state/common/selectors';
import { ScreenTypes } from '../../state/common/types';
import { ConnectWalletButton } from '../ConnectWalletButton';

interface MenuListProps {
  classNames: {
    menuWrapper?: string;
    nav?: string;
    navLink?: string;
    navLinkActive?: string;
  };
}

const MenuList: FC<MenuListProps> = ({
  classNames: {
    menuWrapper = null,
    nav = null,
    navLink = null,
    navLinkActive = null,
  },
}) => {
  const screenMode = useSelector(selectScreeMode);

  return (
    <div className={menuWrapper}>
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
      {screenMode === ScreenTypes.TABLET && <ConnectWalletButton />}
    </div>
  );
};

export default MenuList;
