import { PropsWithChildren, ReactNode, createContext, useContext } from "react";

import { Connection } from "@solana/web3.js";
import type { WalletPassThroughProps } from "../types";
import { useConnectionPassThrough } from "./connection-passthrough-provider";
import { useWallet as useWalletAdapterReact } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

interface WalletPassThroughStructure extends WalletPassThroughProps {
  connection: Connection | null;
}

const initialPassThrough: WalletPassThroughStructure = {
  publicKey: null,
  wallets: [],
  wallet: null,
  connect: async () => {},
  select: () => {},
  connecting: false,
  connected: false,
  disconnect: async () => {},
  visible: false,
  setVisible: () => {},
  connection: null,
  signAllTransactions: async (T) => T,
};

export const WalletPassthroughContext =
  createContext<WalletPassThroughStructure>(initialPassThrough);

// eslint-disable-next-line react-refresh/only-export-components
export function useWalletPassThrough(): WalletPassThroughStructure {
  return useContext(WalletPassthroughContext);
}

const FromWalletAdapter = ({ children }: PropsWithChildren) => {
  const wallet = useWalletAdapterReact();
  const { connection } = useConnectionPassThrough();

  const { visible, setVisible } = useWalletModal();

  const contextValue: WalletPassThroughStructure = {
    visible,
    setVisible,
    connection,
    ...wallet,
  };

  return (
    <WalletPassthroughContext.Provider value={contextValue}>
      {children}
    </WalletPassthroughContext.Provider>
  );
};

interface WalletPassthroughProviderProps {
  children: ReactNode;
  passthroughWallet?: WalletPassThroughProps;
}

export const WalletPassthroughProvider = ({
  children,
  passthroughWallet,
}: WalletPassthroughProviderProps) => {
  const { connection } = useConnectionPassThrough();

  if (!passthroughWallet) {
    return <FromWalletAdapter>{children}</FromWalletAdapter>;
  }

  if (passthroughWallet) {
    return (
      <WalletPassthroughContext.Provider
        value={{ ...passthroughWallet, connection }}
      >
        {children}
      </WalletPassthroughContext.Provider>
    );
  }

  return <>{children}</>;
};
