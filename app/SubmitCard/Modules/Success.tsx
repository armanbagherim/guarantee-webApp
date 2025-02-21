import Image from "next/image";
import React from "react";
import AdditionalItems from "./AdditionalItems";
import Link from "next/link";

export default function Success() {
  return (
    <div className="text-center ">
      <div className="flex gap-2 justify-center items-center">
        <Image
          className="mb-4 relative top-[4px]"
          alt="موفقیت"
          src="/success.png"
          width={25}
          height={25}
        />
        <h2 className="text-green-500 text-xl mb-2">
          کارت شما با موفقیت ثبت شد
        </h2>
      </div>
      <p className="mb-2 text-xs text-gray-500">
        شما می توانید شرایطی که شامل گارانتی نمی گردد را با هزینه اندک به شرایط
        گارانتی اضافه نمائید
      </p>
      <AdditionalItems />

      <p className="text-green-500 font-bold mb-4">
        <span className="text-black">مبلغ نهایی:</span>{" "}
        <span>1.200.000 تومان</span>
      </p>
      <div className="flex justify-between gap-4">
        <Link
          href="/"
          className="bg-gray-500 p-4 text-white rounded-2xl font-bold text-sm w-full"
        >
          مشاهده کارت ها
        </Link>

        <button
          // onClick={handleNextStep}
          className="bg-green-500 p-4 text-white rounded-2xl font-bold text-sm w-full"
        >
          خرید
        </button>
      </div>
    </div>
  );
}
