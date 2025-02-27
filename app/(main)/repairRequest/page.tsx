import React from "react";
import CardInfo from "./Modules/CardInfo";
import RequestForm from "./Modules/RequestForm";

export default function RepairRequest({ searchParams }) {
  return (
    <div className="mt-8">
      <div className="mb-4">
        <CardInfo
          cardNumber={"MP346623421CD"}
          product="Panasonic Microwave HSP-252"
          requester="آرمان باقری"
        />
      </div>
      <RequestForm />
    </div>
  );
}
