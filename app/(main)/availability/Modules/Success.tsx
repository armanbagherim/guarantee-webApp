'use client'

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import AdditionalItems from "./AdditionalItems";
import Link from "next/link";
import { fetcher } from "@/app/components/admin-components/fetcher";
import { useRouter } from "next/navigation";

export default function Success({ packages, guarantee, paymentGateways, cardTypeState }) {

  const [selectedItems, setSelectedItems] = useState<{ id: number, price: string }[]>([]);
  const [selectedGateway, setSelectedGateway] = useState<number | null>(null);
  const [displayPrice, setDisplayPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const prevTotalRef = useRef(0);
  const router = useRouter()
  // Set first payment gateway as default on mount
  useEffect(() => {
    if (paymentGateways?.length > 0 && !selectedGateway) {
      setSelectedGateway(paymentGateways[0].id);
    }
  }, [paymentGateways]);

  // Calculate the actual total price
  const totalPrice = selectedItems.reduce((sum, item) => {
    return sum + parseInt(item.price.replace(/,/g, ''));
  }, 0);

  useEffect(() => {
    // Check if price changed
    if (prevTotalRef.current !== totalPrice) {
      const isIncreasing = totalPrice > prevTotalRef.current;
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
    if (!selectedGateway) {
      alert("لطفاً درگاه پرداخت را انتخاب کنید");
      return;
    }

    if (selectedItems.length === 0) {
      alert("لطفاً حداقل یک بسته اضافه را انتخاب کنید");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetcher({
        method: "POST",
        url: '/v1/api/guarantee/client/payAdditionalPackages',
        body: {
          guaranteeId: +guarantee.id,
          additionalPackages: selectedItems.map((item) => item.id),
          paymentGatewayId: selectedGateway
        }
      });
      console.log(res);
      router.push(res.result.redirectUrl)
      // Handle successful payment redirection here
    } catch (error) {
      console.log(error);
      alert("خطا در پرداخت. لطفاً مجدداً تلاش کنید");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="text-center max-w-md mx-auto">
      <div className={`flex gap-2 justify-center items-center ${cardTypeState === "vip" && 'flex-col'}`}>
        <Image
          className="mb-4 relative top-[4px]"
          alt="موفقیت"
          src="/success.png"
          width={cardTypeState === 'vip' ? "90" : '24'}
          height={cardTypeState === 'vip' ? "90" : '24'}
        />
        <h2 className="text-green-500 text-xl mb-2">
          کارت شما با موفقیت ثبت شد
        </h2>
      </div>

      {cardTypeState === 'normal' && <><p className="mb-2 text-xs text-gray-500">
        شما می توانید شرایطی که شامل گارانتی نمی گردد را با هزینه اندک به شرایط
        گارانتی اضافه نمائید
      </p>

        <AdditionalItems selectedItems={selectedItems} setSelectedItems={setSelectedItems} packages={packages} />

        <div className="my-6 p-4 bg-gray-50 rounded-lg">
          <p className="font-bold mb-4 text-right">درگاه پرداخت:</p>
          <div className="grid grid-cols-2 gap-3">
            {paymentGateways?.map((gateway) => (
              <button
                key={gateway.id}
                onClick={() => setSelectedGateway(gateway.id)}
                className={`p-3 border rounded-xl transition-all ${selectedGateway === gateway.id
                  ? 'border-green-500 bg-green-50 ring-1 ring-green-500'
                  : 'border-gray-300 hover:border-green-300'}`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Image
                    src={`/${gateway.icon}`}
                    alt={gateway.title}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                  <span>{gateway.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <p className="text-green-500 font-bold my-4">
          <span className="text-black">مبلغ نهایی:</span>{" "}
          <span className={`transition-all duration-300 text-green-500 scale-110`}>
            {formattedDisplayPrice} تومان
          </span>
        </p>
      </>}

      <div className="flex justify-between gap-4 my-6">
        <Link
          href={cardTypeState === 'vip' ? '/vipCards' : '/normalCards'}
          className="bg-gray-500 p-4 text-white rounded-2xl font-bold text-sm w-full hover:bg-gray-600 transition-colors"
        >
          مشاهده کارت ها
        </Link>
        {cardTypeState === "vip" && <Link
          href={`/vipCards/products/${guarantee?.id}`}
          className="bg-green-600 p-4 text-white rounded-2xl font-bold text-sm w-full hover:bg-green-800 transition-colors"
        >
          افزودن محصولات
        </Link>}


        {cardTypeState === 'normal' && <button
          onClick={paymentAdditionalPackage}
          disabled={isLoading}
          className={`bg-green-500 p-4 text-white rounded-2xl font-bold text-sm w-full hover:bg-green-600 transition-colors flex items-center justify-center gap-2 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              در حال پردازش...
            </>
          ) : (
            'پرداخت'
          )}
        </button>}
      </div>
    </div>
  );
}