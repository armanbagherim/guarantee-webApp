import React from "react";
import CardInfo from "./Modules/CardInfo";
import RequestForm from "./Modules/RequestForm";

export default function RepairRequest({ searchParams }) {
  const addresses = [
    {
      id: 1,
      name: "خانه",
      address: "خیابان انقلاب، خیابان کارگر شمالی، کوچه یکم، پلاک ۱۲",
      postalCode: "1234567890",
      city: "تهران",
    },
    {
      id: 2,
      name: "محل کار",
      address: "خیابان انقلاب، خیابان کارگر شمالی، کوچه یکم، پلاک ۱۲",
      postalCode: "1234567890",
      city: "تهران",
    },
    {
      id: 3,
      name: "محل کار",
      address: "خیابان انقلاب، خیابان کارگر شمالی، کوچه یکم، پلاک ۱۲",
      postalCode: "1234567890",
      city: "تهران",
    },
    {
      id: 4,
      name: "محل کار",
      address: "خیابان انقلاب، خیابان کارگر شمالی، کوچه یکم، پلاک ۱۲",
      postalCode: "1234567890",
      city: "تهران",
    },
    {
      id: 5,
      name: "محل کار",
      address: "خیابان انقلاب، خیابان کارگر شمالی، کوچه یکم، پلاک ۱۲",
      postalCode: "1234567890",
      city: "تهران",
    },
  ];
  return (
    <div className="mt-8">
      <div className="mb-4">
        <CardInfo
          cardNumber={"MP346623421CD"}
          product="Panasonic Microwave HSP-252"
          requester="آرمان باقری"
        />
      </div>
      <RequestForm addresses={addresses} />
    </div>
  );
}
