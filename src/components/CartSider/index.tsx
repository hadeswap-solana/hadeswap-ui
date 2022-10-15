import { useSelector } from "react-redux";
import { selectIsMobile } from "../../state/common/selectors";
import CartSiderDesktop from "./CartSider";
import CartSiderMobile from "./mobile/CartSider";

const CartSider = () => {
  const isMobile = useSelector(selectIsMobile);
  return isMobile ? <CartSiderMobile /> : <CartSiderDesktop />;
};

export default CartSider;