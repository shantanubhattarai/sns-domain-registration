import { ArrowLeft } from "../icons";

type Props = {
  goBack: () => void;
  formState: string;
};

const BackButton = ({ goBack, formState }: Props) => {
  return (
    <button
      type="button"
      tabIndex={0}
      onClick={goBack}
      disabled={formState === "processing"}
      className="absolute top-0 p-3 border-0 left-3 text-theme-primary dark:text-theme-secondary"
    >
      <ArrowLeft width={24} height={24} />
    </button>
  );
};

export default BackButton;
