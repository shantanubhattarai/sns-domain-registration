import "./index.css";

import type { WalletPassThroughProps, WidgetProps } from "./types";

import Widget from "./widget";
import { twMerge } from "tailwind-merge";

const EntryPoint = ({
  rootWrapperClassNames,
  rootWrapperStyles,
  isDark,
  ...props
}: WidgetProps) => {
  return (
    <div
      className={twMerge(
        "bonfida-widget-root sns-bw",
        rootWrapperClassNames,
        isDark && "dark",
      )}
      style={rootWrapperStyles}
    >
      <Widget {...props} />
    </div>
  );
};

export type { WidgetProps, WalletPassThroughProps };
export default EntryPoint;
