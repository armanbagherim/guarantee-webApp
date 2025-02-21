import React from "react";

interface ICardInfo {
  cardNumber?: string;
  product?: string;
  requester?: string;
}

export default function CardInfo({
  cardNumber,
  product,
  requester,
}: ICardInfo) {
  return (
    <div className="bg-white flex flex-col gap-4 p-6 rounded-[25px]">
      <div className="flex justify-between">
        <span className="text-xs">ثبت درخواست برای شماره کارت گارانتی</span>
        <span className="text-xs font-bold">{cardNumber}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-xs">کالا</span>
        <span className="text-xs font-bold">{product}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-xs">درخواست دهنده</span>
        <span className="text-xs font-bold">{requester}</span>
      </div>
    </div>
  );
}
