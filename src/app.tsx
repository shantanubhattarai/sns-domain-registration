import "./index.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./global.css";

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
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  useWalletModal,
} from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";

import { FoxWalletWalletAdapter } from "@foxwallet/wallet-adapter-foxwallet";
import { ReactNode } from "react";
import { ToggleDark } from "./lib/components/icons/ToggleDark";
import { ToggleLight } from "./lib/components/icons/ToggleLight";
import Widget from "./lib";

const PUBLIC_RPC = import.meta.env.VITE_PUBLIC_RPC as string;

const SolanaProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ConnectionProvider endpoint={PUBLIC_RPC}>
      <WalletProvider
        autoConnect
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
      >
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const Content = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const { visible, setVisible } = useWalletModal();
  const [isDark, toggleDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <>
      <button
        className="toggle-dark-button"
        onClick={() => toggleDark(!isDark)}
      >
        {isDark ? <ToggleLight /> : <ToggleDark />}
      </button>

      <Widget
        connection={connection}
        // endpoint={PUBLIC_RPC}
        passthroughWallet={{ ...wallet, visible, setVisible }}
        isDark={isDark}
        rootWrapperClassNames=""
      />
    </>
  );
};

function App() {
  return (
    <SolanaProvider>
      <Content />
    </SolanaProvider>
  );
}

export default App;
