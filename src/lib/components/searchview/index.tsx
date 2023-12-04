import { useDomainSuggestions, useSearch } from "@bonfida/sns-react";

import { CartContext } from "../../contexts/cart";
import { CustomButton } from "../button";
import { DomainCardSkeleton } from "../domain-card-skeleton";
import { DomainSearchResultRow } from "../domain-search-result-row";
import { useContext } from "react";
import { useWalletPassThrough } from "../../contexts/wallet-passthrough-provider";

type Views = "home" | "search" | "cart";

type Props = {
  searchQuery: string;
  setCurrentView: React.Dispatch<React.SetStateAction<Views>>;
};

const SearchView = ({ searchQuery, setCurrentView }: Props) => {
  const { isCartEmpty } = useContext(CartContext);
  const {
    connected,
    setVisible,
    visible: isWalletSelectorVisible,
    connection,
  } = useWalletPassThrough();

  const domains = useSearch({ connection: connection!, domain: searchQuery });
  const suggestions = useDomainSuggestions({
    connection: connection!,
    domain: searchQuery,
  });

  return (
    <>
      <div className="px-3 mb-3 overflow-auto animate-fade-in">
        {domains.loading ? (
          <DomainCardSkeleton />
        ) : (
          <>
            {domains.result?.map((domain) => (
              <DomainSearchResultRow
                key={domain.domain}
                domain={domain.domain}
                available={domain.available}
              />
            ))}
          </>
        )}

        <div className="mt-4">
          <div className="flex flex-col gap-2 pb-14">
            {suggestions.loading ? (
              <>
                {new Array(5).fill(0).map((_, index) => (
                  <DomainCardSkeleton key={index} />
                ))}
              </>
            ) : (
              <>
                {suggestions.status !== "error" && (
                  <p className="mb-2 text-md text-text-secondary font-primary">
                    You might also like
                  </p>
                )}

                {suggestions.status === "error" && (
                  <div>
                    <p className="mb-6 text-sm tracking-widest text-center">
                      Looks like we have an issue helping you with domain
                      suggestions.
                    </p>

                    <button
                      type="button"
                      className="m-auto flex items-center gap-2 px-3 h-[32px] w-max py-1 text-xs tracking-wide rounded-lg bg-theme-secondary font-primary text-theme-primary"
                      tabIndex={0}
                      aria-label={`Try load suggestions for ${searchQuery} again`}
                      onClick={() => suggestions.execute()}
                    >
                      Try again '{searchQuery}'
                    </button>
                  </div>
                )}

                {suggestions.result?.map((domain) => (
                  <DomainSearchResultRow
                    key={domain.domain}
                    domain={domain.domain}
                    available={domain.available}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
      {!isCartEmpty && (
        <div className="absolute w-full left-3 right-3 bottom-3">
          <CustomButton
            className="px-16 mx-auto shadow-md text-base-button-content hover:bg-background-primary hover:text-theme-primary hover:border"
            onClick={() => {
              if (connected) setCurrentView("cart");
              else setVisible(!isWalletSelectorVisible);
            }}
          >
            {connected ? "Go to cart" : "Connect your wallet"}
          </CustomButton>
        </div>
      )}
    </>
  );
};

export default SearchView;
