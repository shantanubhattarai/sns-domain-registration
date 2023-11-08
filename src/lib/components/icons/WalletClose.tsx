import { createElement, type ComponentPropsWithoutRef } from "react";

export const WalletClose = (props: ComponentPropsWithoutRef<"svg">) => {
  return createElement(
    "svg",
    {
      fill: "none",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      width: "1em",
      height: "1em",
      ...props,
    },
    createElement("path", {
      stroke: "currentColor",
      strokeLinejoin: "round",
      strokeWidth: 1.5,
      d: "M22 7a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v10a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4V7Z",
    }),
    createElement("path", {
      stroke: "currentColor",
      strokeLinejoin: "round",
      strokeWidth: 1.5,
      d: "M8 12a3 3 0 0 0-3-3H2v6h3a3 3 0 0 0 3-3Z",
    }),
  );
};
