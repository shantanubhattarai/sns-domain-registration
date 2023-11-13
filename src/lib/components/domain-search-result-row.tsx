import { Tick, TrashBent } from "../components/icons";
import { useContext, useEffect, useState } from "react";

import { CartContext } from "../contexts/cart";
import { DomainCardBase } from "./domain-card-base";
import { priceFromLength } from "../utils";
import { twMerge } from "tailwind-merge";

export const DomainSearchResultRow = ({
  domain,
  available = false,
  price,
}: {
  domain: string;
  available?: boolean;
  price?: number;
}) => {
  const { cart, addToCart, removeFromCart } = useContext(CartContext);
  price = price ?? priceFromLength(domain);
  const isInCart = Boolean(cart[domain]);

  const [showRemoveButton, toggleRemoveButton] = useState(isInCart);

  const remove = (domain: string) => {
    toggleRemoveButton(false);
    removeFromCart(domain);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isInCart && !showRemoveButton) {
      timer = setTimeout(() => {
        toggleRemoveButton(true);
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [isInCart, showRemoveButton]);

  return (
    <DomainCardBase domain={domain} available={available} price={price}>
      {!available && (
        <div className="px-3 rounded-lg bg-accent bg-opacity-10">
          <span className="text-sm font-semibold leading-6 tracking-wider text-accent">
            Registered
          </span>
        </div>
      )}
      {available && (
        <div
          className={twMerge(
            "flex items-center flex-row justify-between min-w-[93px]",
            available ? "gap-2" : "gap-1",
          )}
        >
          <button
            type="button"
            className={twMerge(
              "flex items-center gap-2 px-4 py-2 text-sm text-theme-primary rounded-lg font-primary bg-background-primary border border-interactive-border hover:border-theme-primary active:bg-theme-primary active:text-base-button-content",
              isInCart &&
                showRemoveButton &&
                "bg-transparent text-theme-primary dark:text-theme-secondary",
            )}
            tabIndex={0}
            onClick={() =>
              isInCart
                ? remove(domain)
                : addToCart({ domain, storage: 1_000, price: Number(price) })
            }
          >
            {!isInCart ? (
              <>Add to cart</>
            ) : (
              <>
                {showRemoveButton ? (
                  <>
                    Remove
                    <TrashBent width={24} height={24} />
                  </>
                ) : (
                  <>
                    Added
                    <Tick width={24} height={24} />
                  </>
                )}
              </>
            )}
          </button>
        </div>
      )}
    </DomainCardBase>
  );
};
