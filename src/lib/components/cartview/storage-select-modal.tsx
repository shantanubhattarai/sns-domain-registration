import { Information, RemoveThin } from "../icons";

import { BaseModal } from "../modal";
import { CartContext } from "../../contexts/cart";
import { twMerge } from "tailwind-merge";
import { useContext } from "react";

type Props = {
  selectedStorageDomain: string;
  editStorageForDomain: (value: string) => void;
};

const SIZES_LIST = [
  { label: "1kb", value: 1_000 },
  { label: "2kb", value: 2_000 },
  { label: "3kb", value: 3_000 },
  { label: "4kb", value: 4_000 },
  { label: "5kb", value: 5_000 },
  { label: "6kb", value: 6_000 },
  { label: "7kb", value: 7_000 },
  { label: "8kb", value: 8_000 },
  { label: "9kb", value: 9_000 },
  { label: "10kb", value: 10_000 },
];

const StorageSelectModal = ({
  selectedStorageDomain,
  editStorageForDomain,
}: Props) => {
  const { cart, addToCart } = useContext(CartContext);
  return (
    <BaseModal
      isVisible={!!selectedStorageDomain}
      toggleVisibility={() => editStorageForDomain("")}
    >
      {!!selectedStorageDomain && (
        <div className="w-[320px] p bg-background-primary flex flex-col gap-3 p-4 rounded-xl border border-field-border">
          <p className="flex items-center justify-between text-lg font-medium font-primary">
            <span>Storage size</span>
            <button
              type="button"
              tabIndex={0}
              className=""
              onClick={() => editStorageForDomain("")}
            >
              <RemoveThin width={24} height={24} />
            </button>
          </p>

          <div className="text-sm">
            <p className="mb-2">
              The storage size will determine the maximum amount of data you can
              store on your domain.
            </p>

            <p className="flex items-center justify-start gap-2 text-xs text-accent">
              <Information
                width={24}
                height={24}
                className="inline mr-1 mb-[2px] text-accent"
              />
              Each additional kb of memory costs around 0.007 SOL (0.001 USDC)
            </p>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {SIZES_LIST.map((size) => {
              const domain = cart[selectedStorageDomain];

              const selected = size.value === domain?.storage;

              return (
                <button
                  type="button"
                  tabIndex={0}
                  key={size.value}
                  className={twMerge(
                    "border-2 border-solid rounded-lg px-2 py-2 border-theme-primary border-opacity-10 text-sm",
                    selected && "border-opacity-100",
                  )}
                  onClick={() => {
                    addToCart({ ...domain, storage: size.value });
                    editStorageForDomain("");
                  }}
                >
                  {size.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </BaseModal>
  );
};

export default StorageSelectModal;
