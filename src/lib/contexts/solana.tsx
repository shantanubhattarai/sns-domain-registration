import "@solana/wallet-adapter-react-ui/styles.css";

import {
  BitKeepWalletAdapter,
  CloverWalletAdapter,
  Coin98WalletAdapter,
  CoinbaseWalletAdapter,
  HuobiWalletAdapter,
  MathWalletAdapter,
  NekoWalletAdapter,
  NightlyWalletAdapter,
  SalmonWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  TrustWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { Fragment, ReactNode, useMemo } from "react";

import { Connection } from "@solana/web3.js";
import { ConnectionPassthroughProvider } from "./connection-passthrough-provider";
import { FoxWalletWalletAdapter } from "@foxwallet/wallet-adapter-foxwallet";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import type { WalletPassThroughProps } from "../types";
import { WalletPassthroughProvider } from "./wallet-passthrough-provider";

export const SolanaProvider = ({
  children,
  endpoint,
  connection,
  passthroughWallet,
}: {
  endpoint?: string;
  connection?: Connection;
  children: ReactNode;
  passthroughWallet?: WalletPassThroughProps;
}) => {
  const ShouldWrapConnectionProvider = useMemo(() => {
    if (endpoint && !connection) {
      return ({ children }: { children: ReactNode }) => (
        <ConnectionProvider endpoint={endpoint}>{children}</ConnectionProvider>
      );
    }
    return Fragment;
  }, [endpoint, connection]);

  const ShouldWrapWalletProvider = useMemo(() => {
    if (!passthroughWallet) {
      return ({ children }: { children: ReactNode }) => (
        <WalletProvider
          wallets={[
            new SolflareWalletAdapter(),
            new TorusWalletAdapter(),
            new MathWalletAdapter(),
            new Coin98WalletAdapter(),
            new CloverWalletAdapter(),
            new HuobiWalletAdapter(),
            new CoinbaseWalletAdapter(),
            new BitKeepWalletAdapter(),
            new NekoWalletAdapter(),
            new TrustWalletAdapter(),
            new NightlyWalletAdapter(),
            new SalmonWalletAdapter(),
            new FoxWalletWalletAdapter(),
          ]}
          autoConnect
        >
          {children}
        </WalletProvider>
      );
    }
    return Fragment;
  }, [passthroughWallet]);

  return (
    <ShouldWrapConnectionProvider>
      <ShouldWrapWalletProvider>
        <WalletModalProvider>
          <ConnectionPassthroughProvider connection={connection}>
            <WalletPassthroughProvider passthroughWallet={passthroughWallet}>
              {children}
            </WalletPassthroughProvider>
          </ConnectionPassthroughProvider>
        </WalletModalProvider>
      </ShouldWrapWalletProvider>
    </ShouldWrapConnectionProvider>
  );
};
