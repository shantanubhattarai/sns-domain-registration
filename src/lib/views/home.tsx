import { useState, useContext, type CSSProperties } from "react";
import { twMerge } from "tailwind-merge";
import { FidaLogo } from "../components/fida-logo";
import { CartView } from "./cart";
import { ConnectWalletButton } from "../components/connect-wallet-button";
import { GlobalStatusCard } from "../components/global-status";
import { GlobalStatusContext } from "../contexts/status-messages";
import { WidgetProps } from "..";
import CartLinkButton from "../components/cart-link-button";
import SearchForm from "../components/search-form";
import SearchView from "../components/searchview";
import HomeFooter from "../components/homeview/home-footer";
type Views = "home" | "search" | "cart";

type Props = {
  className?: string;
  style?: CSSProperties;
  partnerLogo?: WidgetProps["partnerLogo"];
};

export const WidgetHome = ({ className, style, partnerLogo }: Props = {}) => {
  const [currentView, setCurrentView] = useState<Views>("home");
  const [finished, toggleTransitionFinish] = useState(false);
  const [searchInput, updateSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { status } = useContext(GlobalStatusContext);

  const resetView = (hard = false) => {
    if (hard) {
      setSearchQuery("");
      updateSearchInput("");
      toggleTransitionFinish(false);
      setCurrentView("home");
    } else {
      setCurrentView("search");
    }
  };

  const isHomeView = currentView === "home";
  const isSearchView = currentView === "search";
  const isCartView = currentView === "cart";

  return (
    <div
      className={twMerge(
        "flex flex-col bg-background-primary rounded-lg relative text-text-primary h-full",
        className,
      )}
      style={style}
      aria-label="Allows you to quickly search and buy .sol domains"
    >
      {status && <GlobalStatusCard status={status} />}

      <div className="flex items-center justify-end px-3 pt-3">
        {!isHomeView && (
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-center text-text-primary">
            <span className="h-[26px] flex" onClick={() => resetView(true)}>
              <FidaLogo />
            </span>
            {partnerLogo && (
              <>
                <span>x</span>
                <span className="flex">{partnerLogo}</span>
              </>
            )}
          </div>
        )}
        <CartLinkButton setCurrentView={setCurrentView} />
        <ConnectWalletButton />
      </div>

      <div className="flex flex-col flex-grow overflow-auto">
        {(isHomeView || isSearchView) && (
          <>
            <SearchForm
              isSearchView={isSearchView}
              finished={finished}
              searchInput={searchInput}
              setCurrentView={setCurrentView}
              setSearchQuery={setSearchQuery}
              toggleTransitionFinish={toggleTransitionFinish}
              updateSearchInput={updateSearchInput}
            />

            {isSearchView && (
              <SearchView
                setCurrentView={setCurrentView}
                searchQuery={searchQuery}
              />
            )}
          </>
        )}

        {isCartView && <CartView backHandler={resetView} />}
      </div>

      {isHomeView && <HomeFooter />}
    </div>
  );
};
