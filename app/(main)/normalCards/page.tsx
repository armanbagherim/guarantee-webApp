import Cart from "@/app/components/design/Cart";
import Link from "next/link";
import React from "react";

export default function NormalCards() {
  return (
    <div className="mt-8">
      <div className="grid 2xl::grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4">
        <div>
          <div className="mb-2">
            <Cart expireDate="10/32" color="#039a0b" cardNumber="a2X123sXafG" />
          </div>
          <Link
            href="/repairRequest"
            className="bg-primary block text-center p-4 text-white rounded-2xl font-bold text-sm w-full"
          >
            ثبت درخواست تعمیر
          </Link>
        </div>
        <div>
          <div className="mb-2">
            <Cart expireDate="10/32" color="#039a0b" cardNumber="a2X123sXafG" />
          </div>
          <Link
            href="/repairRequest"
            className="bg-primary block text-center p-4 text-white rounded-2xl font-bold text-sm w-full"
          >
            ثبت درخواست تعمیر
          </Link>
        </div>
        <div>
          <div className="mb-2">
            <Cart expireDate="10/32" color="#039a0b" cardNumber="a2X123sXafG" />
          </div>
          <Link
            href="/repairRequest"
            className="bg-primary block text-center p-4 text-white rounded-2xl font-bold text-sm w-full"
          >
            ثبت درخواست تعمیر
          </Link>
        </div>
        <div>
          <div className="mb-2">
            <Cart expireDate="10/32" color="#039a0b" cardNumber="a2X123sXafG" />
          </div>
          <Link
            href="/repairRequest"
            className="bg-primary block text-center p-4 text-white rounded-2xl font-bold text-sm w-full"
          >
            ثبت درخواست تعمیر
          </Link>
        </div>
        <div>
          <div className="mb-2">
            <Cart expireDate="10/32" color="#039a0b" cardNumber="a2X123sXafG" />
          </div>
          <Link
            href="/repairRequest"
            className="bg-primary block text-center p-4 text-white rounded-2xl font-bold text-sm w-full"
          >
            ثبت درخواست تعمیر
          </Link>
        </div>
      </div>
    </div>
  );
}
