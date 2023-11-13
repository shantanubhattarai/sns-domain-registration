import { twMerge } from "tailwind-merge";

type Step = 1 | 2 | 3;

type Props = {
  step: Step;
};

const progressWidth: Record<Step, string> = {
  1: "w-[33%]",
  2: "w-[66%]",
  3: "w-full",
};

const ProgressBar = ({ step }: Props) => {
  return (
    <div className="w-[175px] h-[5px] rounded-md bg-background-interactive dark:bg-background-secondary bg-gradient-to-r">
      <div
        className={twMerge(
          "bg-theme-primary dark:bg-theme-secondary h-full rounded-md transition-[width] duration-500",
          progressWidth[step],
        )}
      ></div>
    </div>
  );
};
export default ProgressBar;
