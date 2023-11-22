import { FormEvent } from "react";
import { InputField } from "./input-field";
import { SearchShort } from "./icons";
import { sanitize } from "../utils";
import { twMerge } from "tailwind-merge";
import { useState } from "react";

type Views = "home" | "search" | "cart";

type Props = {
  isSearchView: boolean;
  finished: boolean;
  toggleTransitionFinish: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentView: React.Dispatch<React.SetStateAction<Views>>;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  searchInput: string;
  updateSearchInput: React.Dispatch<React.SetStateAction<string>>;
};

const SearchForm = ({
  isSearchView,
  finished,
  toggleTransitionFinish,
  setCurrentView,
  setSearchQuery,
  searchInput,
  updateSearchInput,
}: Props) => {
  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCurrentView("search");
    setSearchQuery(searchInput);
  };

  const [invalidSearchQuery, setInvalidSearchQuery] = useState(false);
  const [timeoutId, setTimeoutId] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const onSearchQueryUpdate = (value: string) => {
    setInvalidSearchQuery(false);
    if (timeoutId) clearTimeout(timeoutId);

    updateSearchInput(
      sanitize({
        value,
        prev: searchInput,
        onError: () => {
          setInvalidSearchQuery(true);

          const timeoutId = setTimeout(() => {
            setInvalidSearchQuery(false);
          }, 3000);

          setTimeoutId(timeoutId);
        },
      }),
    );
  };

  return (
    <div
      className={twMerge(
        "translate-y-[80px] transition-all duration-700 px-3",
        isSearchView && "-translate-y-[22px]",
      )}
    >
      <h1
        className={twMerge(
          "block max-h-[32px] text-2xl font-medium text-center font-primary transition-[opacity] ease-out duration-200",
          isSearchView && "opacity-0 invisible",
          finished && "max-h-0",
        )}
        onTransitionEnd={() => {
          if (isSearchView) toggleTransitionFinish(true);
        }}
      >
        Secure a custom domain
      </h1>

      <form className="flex gap-2 mt-10" onSubmit={search}>
        <InputField
          value={searchInput}
          placeholder="Search your domain"
          autoCapitalize="off"
          spellCheck="false"
          enterKeyHint="search"
          type="search"
          required
          errorMessage={
            invalidSearchQuery ? "Character not allowed" : undefined
          }
          onChange={(e) => onSearchQueryUpdate(e.target.value)}
        />

        <button
          className="
                    rounded-[10px] bg-background-primary h-[64px] w-[64px] p-2
                    flex items-center justify-center text-theme-primary
                    border
                    border-interactive-border
                    hover:border-theme-primary
                    active:bg-theme-primary active:text-base-button-content
                  "
          tabIndex={0}
        >
          <SearchShort width={24} height={24} />
        </button>
      </form>
    </div>
  );
};
export default SearchForm;
