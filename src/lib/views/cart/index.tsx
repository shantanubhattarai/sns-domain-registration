import {
  FIDA_MINT,
  chunkIx,
  formatPrice,
  tokenList,
  unwrapSol,
  wrapSol,
} from "../../utils";
import { NATIVE_MINT, getAssociatedTokenAddressSync } from "@solana/spl-token";
import {
  PublicKey,
  Transaction,
  type TransactionInstruction,
} from "@solana/web3.js";
import { useContext, useEffect, useState } from "react";
import { usePyth, useWalletBalances } from "../../hooks";
import { getDomainPriceFromName } from "@bonfida/spl-name-service";

import BackButton from "../../components/cartview/back-button";
import { BaseModal } from "../../components/modal";
import { CartContext } from "../../contexts/cart";
import { CartError } from "./error";
import { CartProcessing } from "./processing";
import { CartSuccess } from "./success";
import { CustomButton } from "../../components/button";
import { DomainCartItem } from "../../components/domain-cart-item";
import { GlobalStatusContext } from "../../contexts/status-messages";
import ProgressBar from "../../components/cartview/progress-bar";
import StorageSelectModal from "../../components/cartview/storage-select-modal";
import { WalletClose } from "../../components/icons";
import { WalletSignTransactionError } from "@solana/wallet-adapter-base";
import { registerDomainName } from "@bonfida/spl-name-service";
import { twMerge } from "tailwind-merge";
import { useWalletPassThrough } from "../../contexts/wallet-passthrough-provider";

type Step = 1 | 2 | 3;

interface CartViewProps {
  backHandler: (hard?: boolean) => void;
}

export const CartView = ({ backHandler }: CartViewProps) => {
  const pyth = usePyth();
  const { publicKey, connection, signAllTransactions } = useWalletPassThrough();
  const { balances } = useWalletBalances();

  const [step, setStep] = useState<Step>(1);
  const { cart, emptyCart } = useContext(CartContext);
  const { setError } = useContext(GlobalStatusContext);
  const [selectedToken, selectToken] = useState(tokenList[0]);
  const [isTokenSelectorOpen, toggleTokenSelector] = useState(false);
  const [selectedStorageDomain, editStorageForDomain] = useState("");

  const [formState, setFormState] = useState<
    "registering" | "processing" | "success" | "error"
  >("registering");

  const isSelectedTokenFIDA = selectedToken.mintAddress === FIDA_MINT;
  const discountMul = isSelectedTokenFIDA ? 0.95 : 1;
  const totalUsd = Object.values(cart).reduce(
    (acc, v) => acc + getDomainPriceFromName(v.domain) * discountMul,
    0,
  );

  useEffect(() => {}, [publicKey, connection]);

  const getTotalPrice = (mintAddress: string) => {
    const price = pyth.result?.get(mintAddress)?.price;

    return totalUsd / (price || 1);
  };

  const getTotalPriceWithDiscount = (mintAddress: string) => {
    const total = getTotalPrice(mintAddress);
    if (mintAddress === FIDA_MINT) return total * 0.95;
    return total;
  };

  useEffect(() => {
    if (!Object.keys(cart).length) {
      backHandler();
    }
  }, [cart, backHandler]);

  const goBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      backHandler();
    }
  };

  const processStep = async () => {
    switch (step) {
      case 2:
        await handle();
        break;
      case 3:
        if (formState === "error") await handle();
        if (formState === "success") {
          emptyCart();
          backHandler(true);
        }
        break;
      default:
        setStep((step + 1) as Step);
        break;
    }
  };

  const selectedTokenTotal = getTotalPriceWithDiscount(
    selectedToken.mintAddress,
  );

  const handle = async () => {
    if (!connection || !publicKey || !signAllTransactions) return;
    if (balances[selectedToken.tokenSymbol] < selectedTokenTotal) {
      setError("You don’t have enough funds");
      return;
    }
    try {
      setFormState("processing");
      let ixs: TransactionInstruction[] = [];

      const buyer = new PublicKey(publicKey);
      const mintKey = new PublicKey(selectedToken.mintAddress);

      const ata = getAssociatedTokenAddressSync(mintKey, buyer);
      for (const item of Object.values(cart)) {
        const [, ix] = await registerDomainName(
          connection,
          item.domain,
          item.storage,
          buyer,
          ata,
          mintKey,
        );
        ixs.push(...ix);
      }

      // Wrap/Unwrap SOL
      if (NATIVE_MINT.equals(mintKey)) {
        const wrap = await wrapSol(
          connection,
          ata,
          buyer,
          Math.ceil(selectedTokenTotal * 1.01 * Math.pow(10, 9)),
        );
        const unwrap = unwrapSol(ata, buyer);
        ixs = [...wrap, ...ixs, ...unwrap];
      }

      const chunked = chunkIx(ixs, buyer);
      const { blockhash } = await connection.getLatestBlockhash();
      let txs = chunked.map((e) => new Transaction().add(...e));
      txs.forEach((e) => {
        e.feePayer = buyer;
        e.recentBlockhash = blockhash;
      });

      txs = await signAllTransactions(txs);
      for (const tx of txs) {
        const sig = await connection.sendRawTransaction(tx.serialize());
        await connection.confirmTransaction(sig);
        console.log(sig);
      }

      setFormState("success");
      setStep(3);
    } catch (err) {
      console.error(err);
      if (err instanceof WalletSignTransactionError) {
        setError(err.message);
        setFormState("registering");
        return;
      }
      setStep(3);
      setFormState("error");
    }
  };

  return (
    <div className="flex flex-col flex-grow pb-14">
      <div className="sticky -top-1 bg-background-primary h-[48px] flex justify-center items-center px-3">
        <BackButton goBack={goBack} formState={formState} />

        <ProgressBar step={step} />
      </div>
      <div className="flex flex-col flex-grow pt-6 body">
        {formState === "success" && <CartSuccess />}
        {formState === "error" && <CartError />}
        {formState === "processing" && <CartProcessing />}
        {formState === "registering" && (
          <>
            {step === 1 && (
              <>
                <p className="px-3 mb-2 ml-4 text-sm text-text-secondary font-primary">
                  You are registering
                </p>

                <div className="flex flex-col gap-2 px-3 pb-4">
                  {Object.values(cart).map((item) => (
                    <DomainCartItem
                      key={item.domain}
                      domain={item.domain}
                      onEdit={() => editStorageForDomain(item.domain)}
                    />
                  ))}
                </div>

                <StorageSelectModal
                  editStorageForDomain={editStorageForDomain}
                  selectedStorageDomain={selectedStorageDomain}
                />
              </>
            )}
            {step === 2 && (
              <div className="flex flex-col flex-grow px-3 pb-5">
                <div className="mb-auto">
                  <p className="mb-3 ml-4 font-medium font-primary">Pay with</p>
                  <div>
                    <button
                      type="button"
                      tabIndex={0}
                      className="flex items-center w-full gap-4 p-4 border cursor-pointer rounded-xl border-interactive-border bg-background-interactive"
                      onClick={() => toggleTokenSelector(!isTokenSelectorOpen)}
                    >
                      <img
                        className="w-4 h-4 rounded-[50%]"
                        src={selectedToken.icon}
                        alt={selectedToken.tokenSymbol}
                      />
                      <span className="tracking-wide text-text-primary">
                        {selectedToken.tokenSymbol}
                      </span>
                      <div className="relative w-[25px] h-[25px] flex justify-center items-center ml-auto">
                        <div
                          className={twMerge(
                            "transition-transform duration-200 absolute w-[8px] h-[2px] bg-theme-primary dark:bg-theme-secondary rounded-sm -rotate-[45deg] ml-[5px]",
                            isTokenSelectorOpen && "rotate-[45deg]",
                          )}
                        ></div>
                        <div
                          className={twMerge(
                            "transition-transform duration-200 absolute w-[8px] h-[2px] bg-theme-primary dark:bg-theme-secondary rounded-sm rotate-[45deg] -ml-[4px]",
                            isTokenSelectorOpen && "-rotate-[45deg]",
                          )}
                        ></div>
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <p className="mb-3 font-medium font-primary">Order summary</p>
                  <div className="flex items-start justify-between mb-2 text-sm font-medium leading-6 border-b border-interactive-border">
                    <div>Total</div>
                    <div className="flex flex-col items-end">
                      <span>
                        {formatPrice(selectedTokenTotal, true)}{" "}
                        {selectedToken.tokenSymbol}
                      </span>
                      <span className="text-xs leading-6 text-text-primary text-opacity-60 dark:text-text-secondary">
                        {formatPrice(totalUsd)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start justify-between text-sm font-medium leading-6 border-b border-interactive-border">
                    <div>Discount</div>
                    <div>{isSelectedTokenFIDA ? "5%" : "0%"}</div>
                  </div>
                </div>

                <BaseModal
                  isVisible={isTokenSelectorOpen}
                  toggleVisibility={toggleTokenSelector}
                >
                  <div className="w-[320px] bg-background-primary flex flex-col gap-3 py-3 rounded-xl border border-field-border">
                    {tokenList.slice(1).map((item) => {
                      const total = getTotalPriceWithDiscount(item.mintAddress);
                      const isNotEnoughFunds =
                        balances[item.tokenSymbol] < total;
                      return (
                        <button
                          key={item.tokenSymbol}
                          type="button"
                          tabIndex={0}
                          disabled={isNotEnoughFunds}
                          className={twMerge(
                            "flex items-center gap-3 px-3 py-1 max-w duration-200",
                            "font-primary transition-[background-color]",
                            selectedToken.mintAddress === item.mintAddress &&
                              "bg-background-tertiary",
                            isNotEnoughFunds && "opacity-40",
                            !isNotEnoughFunds &&
                              "hover:bg-background-tertiary focus:bg-background-tertiary cursor-pointer",
                          )}
                          onClick={() => {
                            selectToken(item);
                            toggleTokenSelector(false);
                          }}
                        >
                          <img
                            src={item.icon}
                            alt={item.tokenSymbol}
                            className="w-6 h-6 rounded-[50%]"
                          />
                          <div className="flex flex-col items-start">
                            <span>{item.tokenSymbol}</span>
                            <span className="flex text-xs text-text-secondary gap-0.5 items-center">
                              <WalletClose width={14} height={14} />
                              {balances[item.tokenSymbol]}
                            </span>
                          </div>
                          <div className="flex flex-col ml-auto text-sm">
                            <span
                              className={twMerge(
                                "tabular-nums",
                                item.mintAddress === FIDA_MINT &&
                                  "line-through",
                              )}
                            >
                              {formatPrice(
                                getTotalPrice(item.mintAddress),
                                true,
                              )}{" "}
                              {item.tokenSymbol}
                            </span>
                            <span className="tabular-nums text-success">
                              {item.mintAddress === FIDA_MINT && (
                                <>
                                  {formatPrice(
                                    getTotalPriceWithDiscount(item.mintAddress),
                                    true,
                                  )}{" "}
                                  FIDA
                                </>
                              )}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </BaseModal>
              </div>
            )}
          </>
        )}
      </div>

      {formState === "processing" ? null : (
        <div className="absolute flex flex-col gap-2 left-3 right-3 bottom-4">
          <CustomButton
            className={twMerge(
              "px-16 mx-auto shadow-md text-base-button-content enabled:hover:bg-background-primary enabled:hover:text-theme-primary enabled:hover:border",
              formState === "error" && "bottom-[70px]",
            )}
            onClick={processStep}
            disabled={
              step === 2 &&
              formState === "registering" &&
              selectedToken.decimals === tokenList[0].decimals
            }
          >
            {step === 1 && "Continue to payment"}
            {step === 2 &&
              formState === "registering" &&
              "Confirm and register"}
            {formState === "success" && "Done"}
            {formState === "error" && "Retry"}
          </CustomButton>

          {formState === "error" && (
            <CustomButton
              className={twMerge("bg-transparent text-theme-primary")}
              onClick={() => backHandler()}
            >
              Close
            </CustomButton>
          )}
        </div>
      )}
    </div>
  );
};
