import { InputHTMLAttributes, useRef } from "react";

import { RemoveThin } from "../components/icons";
import { twMerge } from "tailwind-merge";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string;
}

export const InputField = ({
  type = "text",
  value,
  className,
  errorMessage,
  ...params
}: InputProps = {}) => {
  const input = useRef<HTMLInputElement>(null);
  return (
    <div className={twMerge("flex-grow", type === "search" && "relative")}>
      <input
        {...params}
        ref={input}
        value={value}
        className={twMerge(
          "w-full h-full px-3 py-4 text-xl border border-opacity-25 rounded-xl border-field-border dark:border-interactive-border bg-background-secondary text-ellipsis",
          className,
          type === "search" && "pr-8",
        )}
        type={type === "search" ? "text" : type}
      />

      {type === "search" && value && (
        <button
          type="button"
          className="absolute p-1 top-3 right-1"
          aria-label="Clear"
          tabIndex={0}
          onClick={() => {
            if (input.current) {
              input.current.value = "";
            }
          }}
        >
          <RemoveThin width={24} height={24} />
        </button>
      )}
      {errorMessage && (
        <p className="absolute top-[calc(100%+4px)] text-error font-medium tracking-widest pl-3 text-sm animate-[fade-in_300ms_ease-out]">
          {errorMessage}
        </p>
      )}
    </div>
  );
};
