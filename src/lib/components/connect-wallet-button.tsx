import { DirectionDown, WalletClose } from "../components/icons";

import { abbreviate } from "../utils";
import { twMerge } from "tailwind-merge";
import { useState } from "react";
import { useWalletPassThrough } from "../contexts/wallet-passthrough-provider";

export const ConnectWalletButton = () => {
  const { visible, setVisible, connected, publicKey, disconnect } =
    useWalletPassThrough();

  const [isDropdownVisible, toggleDropdown] = useState(false);

  const handleClick = () => {
    if (!connected) {
      setVisible(!visible);
    } else {
      toggleDropdown(!isDropdownVisible);
    }
  };

  const onDisconnect = () => {
    disconnect();
    toggleDropdown(false);
  };

  return (
    <div className="relative flex ml-4">
      <button
        type="button"
        className="relative flex items-center gap-2 px-3 h-[32px] py-1 text-xs tracking-wide rounded-lg bg-theme-secondary font-primary text-theme-primary"
        tabIndex={0}
        aria-label="Connect wallet"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <WalletClose width={16} height={16} />
        {connected ? abbreviate(publicKey?.toString(), 8, 4) : "Connect wallet"}
        {connected && (
          <DirectionDown
            className={twMerge(
              "transition-transform",
              isDropdownVisible && "rotate-180",
            )}
          />
        )}
      </button>

      <button
        type="button"
        tabIndex={0}
        aria-label="Disconnect wallet"
        className={twMerge(
          !isDropdownVisible && "invisible opacity-0 -translate-y-1",
          "absolute z-50 h-[48px] top-[100%] left-0 right-0 w-full",
          "duration-300 transition-[transform,opacity]",
          "bg-background-secondary rounded-xl text-base flex items-center justify-center text-text-primary",
          "shadow-domain dark:shadow-none dark:border dark:border-interactive-border",
          "active:opacity-70 active:transition-none",
        )}
        onClick={onDisconnect}
      >
        Disconnect
      </button>
    </div>
  );
};
