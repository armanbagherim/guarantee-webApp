'use client'

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import AdditionalItems from "./AdditionalItems";
import Link from "next/link";
import { fetcher } from "@/app/components/admin-components/fetcher";

export default function Success({ packages, guarantee }) {
  const [selectedItems, setSelectedItems] = useState<{ id: number, price: string }[]>([]);
  const [displayPrice, setDisplayPrice] = useState(0);
  const [isIncreasing, setIsIncreasing] = useState(false);
  const prevTotalRef = useRef(0);

  // Calculate the actual total price
  const totalPrice = selectedItems.reduce((sum, item) => {
    return sum + parseInt(item.price.replace(/,/g, ''));
  }, 0);
  console.log(selectedItems)

  useEffect(() => {
    // Check if price changed
    if (prevTotalRef.current !== totalPrice) {
      setIsIncreasing(totalPrice > prevTotalRef.current);
      prevTotalRef.current = totalPrice;

      // Animate the display price
      const duration = 500; // animation duration in ms
      const startTime = performance.now();
      const startValue = displayPrice;
      const endValue = totalPrice;

      const animate = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        const currentValue = startValue + (endValue - startValue) * progress;
        setDisplayPrice(Math.floor(currentValue));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [totalPrice]);

  // Format the number with commas for better readability
  const formattedDisplayPrice = displayPrice.toLocaleString('fa-IR');

  const paymentAdditionalPackage = async () => {
    console.log('h')
    try {
      const res = await fetcher({
        method: "POST", url: '/v1/api/guarantee/client/payAdditionalPackages', body: {
          guaranteeId: +guarantee.id,
          additionalPackages: selectedItems.map((item) => item.id),
          paymentGatewayId: 1
        }
      });
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

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
      <AdditionalItems selectedItems={selectedItems} setSelectedItems={setSelectedItems} packages={packages} />

      <p className="text-green-500 font-bold mb-4">
        <span className="text-black">مبلغ نهایی:</span>{" "}
        <span className={`transition-all duration-300 text-green-500 scale-110`}>
          {formattedDisplayPrice} تومان
        </span>
      </p>
      <div className="flex justify-between gap-4">
        <Link
          href="/"
          className="bg-gray-500 p-4 text-white rounded-2xl font-bold text-sm w-full"
        >
          مشاهده کارت ها
        </Link>

        <button
          onClick={e => paymentAdditionalPackage()}
          className="bg-green-500 p-4 text-white rounded-2xl font-bold text-sm w-full"
        >
          خرید
        </button>
      </div>
    </div>
  );
}