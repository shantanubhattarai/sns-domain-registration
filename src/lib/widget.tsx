import { CartContextProvider } from "./contexts/cart";
import { GlobalStatusContextProvider } from "./contexts/status-messages";
import { SolanaProvider } from "./contexts/solana";
import { WidgetHome } from "./views/home";
import type { WidgetProps } from "./types";

const Widget = ({
  endpoint,
  connection,
  passthroughWallet,
  containerClassNames,
  containerStyles,
  partnerLogo,
}: WidgetProps) => {
  return (
    <SolanaProvider
      endpoint={endpoint}
      connection={connection}
      passthroughWallet={passthroughWallet}
    >
      <CartContextProvider>
        <GlobalStatusContextProvider>
          <WidgetHome
            className={containerClassNames}
            style={containerStyles}
            partnerLogo={partnerLogo}
          />
        </GlobalStatusContextProvider>
      </CartContextProvider>
    </SolanaProvider>
  );
};

export default Widget;
