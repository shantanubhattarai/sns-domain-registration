import { abbreviate, tokenIconBySymbol } from "../utils";

import type { ReactNode } from "react";

export const DomainCardBase = ({
  domain,
  available = false,
  price,
  children,
}: {
  domain: string;
  available?: boolean;
  price?: number | string;
  children: ReactNode;
}) => {
  return (
    <div className="flex flex-row items-center gap-4 px-4 py-3 rounded-xl bg-background-secondary min-h-[72px] border border-field-border">
      <div className="flex flex-col mr-auto">
        <span className="text-base text-content-secondary font-primary">
          {abbreviate(`${domain}.sol`, 25, 3)}
        </span>
        {available && (
          <span className="flex items-center gap-1 text-sm font-medium">
            <img className="w-4 h-4" src={tokenIconBySymbol("USDC")} alt="$" />
            {price}
          </span>
        )}
      </div>

      {children}
    </div>
  );
};
