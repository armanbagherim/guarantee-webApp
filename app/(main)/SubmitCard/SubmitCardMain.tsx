"use client";
import React, { useState, useEffect } from "react";
import CardType from "./Modules/CardType";
import CardNumber from "./Modules/CardNumber";
import { toast } from "react-toastify";
import { Skeleton } from "@mui/material";
import Cart from "../../components/design/Cart";
import Success from "./Modules/Success";
import { fetcher } from "../../components/admin-components/fetcher";
import VipCard from "@/app/components/design/Cart/Vip";

const steps = ["cardType", "serialNumber", "accept", "success"];

export default function SubmitCardMain({ packages, paymentGateways }) {
  const [state, setState] = useState<string>("cardType");
  const [cardTypeState, setCardTypeState] = useState("normal");
  const [loading, setLoading] = useState(true);
  const [cardNumber, setCardNumber] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [guarantee, setGuarantee] = useState(null);
  const handleNextStep = async () => {
    if (!(await validateStep(state))) {
      return;
    }

    const currentStepIndex = steps.indexOf(state);
    if (currentStepIndex < steps.length - 1) {
      const nextStep = steps[currentStepIndex + 1];
      setState(nextStep);
    }
  };

  const handlePrevStep = () => {
    const currentStepIndex = steps.indexOf(state);
    if (currentStepIndex > 0) {
      const prevStep = steps[currentStepIndex - 1];
      setState(prevStep);
    }
  };

  const validateStep = async (step: string) => {
    let result = true;
    setSubmitLoading(true);
    if (step === "serialNumber" && !cardNumber) {
      toast.error("لطفا شماره کارت معتبر وارد کنید");
      result = false;
    } else if (step === "serialNumber" && cardNumber) {
      try {
        const result = await fetcher({
          url: cardTypeState === "normal" ? `/v1/api/guarantee/client/normalGuarantee/availability/${cardNumber}` : `/v1/api/guarantee/client/vipGuarantees/availability/${cardNumber}`,
          method: "GET",
        });
        setGuarantee(result.result);
      } catch (err) {
        toast.error(err.message);

        result = false;
      }
    } else if (step === "accept" && guarantee !== null) {
      try {
        console.log(cardTypeState)
        const result = await fetcher({
          url: cardTypeState === "normal" ? `/v1/api/guarantee/client/normalGuarantee` : `/v1/api/guarantee/client/vipGuarantees`,
          method: "POST",
          body: {
            serialNumber: cardNumber,
          },
        });
      } catch (err) {
        toast.error(err.message);
        result = false;
      }
    }

    setSubmitLoading(false);
    return result;
  };

  const renderStepContent = () => {
    switch (state) {
      case "cardType":
        return (
          <CardType cardType={cardTypeState} setCardType={setCardTypeState} />
        );
      case "serialNumber":
        return (
          <CardNumber cardNumber={guarantee} setCardNumber={setCardNumber} />
        );
      case "accept":
        return (
          <div className="mb-8">
            {
              cardTypeState === "normal" ? <Cart data={guarantee} color="#039a0b" /> : <VipCard data={guarantee} />
            }
          </div>
        );
      case "success":
        return <Success cardTypeState={cardTypeState} paymentGateways={paymentGateways} guarantee={guarantee} packages={packages} />;
      default:
        return null;
    }
  };

  return (
    <div>
      {renderStepContent()}

      {state !== "success" && (
        <div className="flex justify-between gap-4">
          {state !== "cardType" && (
            <button
              onClick={handlePrevStep}
              className="bg-gray-400 p-4 text-white rounded-2xl font-bold text-sm w-full"
            >
              مرحله قبلی
            </button>
          )}
          {submitLoading ? (
            <button
              onClick={(e) => async () => {
                await handleNextStep();
              }}
              className="bg-primary p-4 text-white rounded-2xl font-bold text-sm w-full"
            >
              <svg
                aria-hidden="true"
                className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 mx-auto fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleNextStep}
              className="bg-primary p-4 text-white rounded-2xl font-bold text-sm w-full"
            >
              {state === "success" ? "تمام" : "مرحله بعد"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
