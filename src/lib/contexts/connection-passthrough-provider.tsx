import { PropsWithChildren, ReactNode, createContext, useContext } from "react";

import type { Connection } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";

interface ConnectionPassThroughStructure {
  connection: Connection | null;
}

export const ConnectionPassthroughContext =
  createContext<ConnectionPassThroughStructure>({ connection: null });

// eslint-disable-next-line react-refresh/only-export-components
export function useConnectionPassThrough(): ConnectionPassThroughStructure {
  return useContext(ConnectionPassthroughContext);
}

const FromConnectionProvider = ({ children }: PropsWithChildren) => {
  const { connection } = useConnection();

  return (
    <ConnectionPassthroughContext.Provider value={{ connection }}>
      {children}
    </ConnectionPassthroughContext.Provider>
  );
};

interface ConnectionPassthroughProviderProps {
  children: ReactNode;
  connection?: Connection;
}

export const ConnectionPassthroughProvider = ({
  children,
  connection,
}: ConnectionPassthroughProviderProps) => {
  if (!connection) {
    return <FromConnectionProvider>{children}</FromConnectionProvider>;
  }

  if (connection) {
    return (
      <ConnectionPassthroughContext.Provider value={{ connection }}>
        {children}
      </ConnectionPassthroughContext.Provider>
    );
  }

  return <>{children}</>;
};
