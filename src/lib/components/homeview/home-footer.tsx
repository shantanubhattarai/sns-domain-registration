import { FidaLogo } from "../fida-logo";

const HomeFooter = () => {
  return (
    <div className="p-3">
      <div className="flex items-center justify-center gap-2 text-sm font-medium text-center text-text-primary">
        Powered by
        <span className="h-[20px]">
          <FidaLogo />
        </span>
      </div>
    </div>
  );
};

export default HomeFooter;
