import { createElement, type ComponentPropsWithoutRef } from "react";

export const RemoveThin = (props: ComponentPropsWithoutRef<"svg">) => {
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
      fill: "currentColor",
      d: "M16.773 8.288a.75.75 0 0 0-1.06-1.061l1.06 1.06Zm-9.546 7.424a.75.75 0 0 0 1.06 1.061l-1.06-1.06Zm8.485 1.06a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM8.288 7.228a.75.75 0 0 0-1.061 1.06l1.06-1.06Zm7.424 0-8.485 8.485 1.06 1.061 8.486-8.485-1.06-1.061Zm1.06 8.485L8.289 7.227l-1.061 1.06 8.485 8.486 1.06-1.06Z",
    }),
  );
};
