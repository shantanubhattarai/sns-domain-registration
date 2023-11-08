import {
  certifyEmoji,
  checkLanguage,
  findCharLanguage,
  isAlphabetical,
} from "@bonfida/emojis";

const forbidden = ["", "."];

export const sanitize = (current: string, prev: string) => {
  if (forbidden.includes(current)) return "";

  if (current.endsWith(".sol")) {
    current = current.split(".sol")[0];
  }
  const lowerTrim = current.toLowerCase().trim();

  const splitted = lowerTrim.split(".");
  const n = splitted.length;

  if (n > 2) {
    return prev;
  }

  for (const x of splitted) {
    const isAlpha = isAlphabetical(x);
    const certified = certifyEmoji(x);

    if (!isAlpha && !certified) return prev;
    if (!checkLanguage(x, findCharLanguage(current[0] || ""))) return prev;
  }

  return lowerTrim;
};
