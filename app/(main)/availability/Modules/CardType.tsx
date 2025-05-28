import React from "react";

export default function CardType({ cardType, setCardType }) {
  return (
    <div>
      <h4 className="text-2xl azarMehr w-full text-center mb-8">
        انتخاب نوع کارت
      </h4>
      <div className="flex gap-4 mb-8">
        <span
          onClick={(e) => setCardType("normal")}
          className={`cursor-pointer py-[22px] text-center border w-full ${
            cardType === "normal" ? "border-primary" : "border-[#D9D9D9] "
          } rounded-[30px]`}
        >
          کارت معمولی
        </span>
        <span
          onClick={(e) => setCardType("vip")}
          className={`cursor-pointer py-[22px] text-center border w-full ${
            cardType === "vip" ? "border-primary" : "border-[#D9D9D9]"
          } rounded-[30px]`}
        >
          کارت VIP
        </span>
      </div>
    </div>
  );
}
