import {
  certifyEmoji,
  checkLanguage,
  findCharLanguage,
  isAlphabetical,
} from "@bonfida/emojis";

const forbidden = ["", "."];

export const sanitize = ({
  value,
  prev,
  onError,
}: {
  value: string;
  prev: string;
  onError?: () => void;
}) => {
  if (forbidden.includes(value)) return "";

  if (value.endsWith(".sol")) {
    value = value.split(".sol")[0];
  }
  const lowerTrim = value.toLowerCase().trim();

  const splitted = lowerTrim.split(".");
  const n = splitted.length;

  if (n > 2) {
    onError?.();
    return prev;
  }

  for (const x of splitted) {
    const isAlpha = isAlphabetical(x);
    const certified = certifyEmoji(x);

    if (!isAlpha && !certified) {
      onError?.();
      return prev;
    }
    if (!checkLanguage(x, findCharLanguage(value[0] || ""))) {
      onError?.();
      return prev;
    }
  }

  return lowerTrim;
};
