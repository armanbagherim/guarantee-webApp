"use client";
import React, { useState, useEffect } from "react";
import CardType from "./Modules/CardType";
import CardNumber from "./Modules/CardNumber";
import { toast } from "react-toastify";
import { Skeleton } from "@mui/material";

const steps = ["cardType", "personalInfo", "address", "summary"];

export default function SubmitCardMain() {
  const [state, setState] = useState<string>("cardType");
  const [cardTypeState, setCardTypeState] = useState("normal");
  const [loading, setLoading] = useState(true);
  const [cardNumber, setCardNumber] = useState("");

  useEffect(() => {
    const savedStep = localStorage.getItem("currentStep");
    if (savedStep && steps.includes(savedStep)) {
      setState(savedStep);
    }
    setTimeout(() => setLoading(false), 2000);
  }, []);

  const saveStepToLocalStorage = (step: string) => {
    localStorage.setItem("currentStep", step);
  };

  const handleNextStep = () => {
    if (!validateStep(state)) {
      return; // Return early if validation fails
    }

    const currentStepIndex = steps.indexOf(state);
    if (currentStepIndex < steps.length - 1) {
      const nextStep = steps[currentStepIndex + 1];
      setState(nextStep);
      saveStepToLocalStorage(nextStep);
    }
  };

  const handlePrevStep = () => {
    const currentStepIndex = steps.indexOf(state);
    if (currentStepIndex > 0) {
      const prevStep = steps[currentStepIndex - 1];
      setState(prevStep);
      saveStepToLocalStorage(prevStep);
    }
  };

  const validateStep = (step: string) => {
    if (step === "personalInfo" && !cardNumber) {
      toast.error("لطفا شماره کارت معتبر وارد کنید");
      return false; // Prevent moving to the next step
    }

    return true;
  };

  const renderStepContent = () => {
    switch (state) {
      case "cardType":
        return (
          <CardType cardType={cardTypeState} setCardType={setCardTypeState} />
        );
      case "personalInfo":
        return (
          <CardNumber cardNumber={cardNumber} setCardNumber={setCardNumber} />
        );
      case "address":
        return <div>Address Form</div>;
      case "summary":
        return (
          <div>
            <h2>خلاصه</h2>
            <p>نوع کارت انتخابی: {cardTypeState}</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <Skeleton variant="rounded" animation="wave" height={250} />;
  }

  return (
    <div>
      {renderStepContent()}

      <div className="flex justify-between gap-8">
        {state !== "cardType" && (
          <button
            onClick={handlePrevStep}
            className="bg-gray-400 p-4 text-white rounded-2xl font-bold text-sm w-full"
          >
            مرحله قبلی
          </button>
        )}
        <button
          onClick={handleNextStep}
          className="bg-primary p-4 text-white rounded-2xl font-bold text-sm w-full"
        >
          {state === "summary" ? "تمام" : "مرحله بعد"}
        </button>
      </div>
    </div>
  );
}
