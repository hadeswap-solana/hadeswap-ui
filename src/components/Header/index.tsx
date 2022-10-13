import { useSelector } from "react-redux";
import { selectIsMobile } from "../../state/common/selectors";
import HeaderDesktop from "./Header";
import HeaderMobile from "./Mobile/Header";

const Header = (): JSX.Element => {
  const isMobile = useSelector<boolean>(selectIsMobile);
  return (<>{isMobile ? <HeaderMobile /> : <HeaderDesktop />}</>)
};

export default Header;