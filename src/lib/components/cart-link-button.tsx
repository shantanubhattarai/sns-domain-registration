import { CartContext } from "../contexts/cart";
import { ShoppingBasketHorizontal } from "./icons";
import { useContext } from "react";
import { useWalletPassThrough } from "../contexts/wallet-passthrough-provider";

type Views = "home" | "search" | "cart";
type Props = {
  setCurrentView: React.Dispatch<React.SetStateAction<Views>>;
};

const CartLinkButton = ({ setCurrentView }: Props) => {
  const { isCartEmpty, cartItemsNumber } = useContext(CartContext);
  const { connected } = useWalletPassThrough();
  return (
    <button
      className="flex items-center gap-1 ml-auto cursor-pointer text-theme-primary disabled:text-text-disabled"
      disabled={!connected || isCartEmpty}
      onClick={() => {
        if (connected) setCurrentView("cart");
      }}
    >
      <ShoppingBasketHorizontal /> {cartItemsNumber}
    </button>
  );
};

export default CartLinkButton;
