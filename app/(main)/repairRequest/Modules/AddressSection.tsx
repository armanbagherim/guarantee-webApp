"use client";
import Address from "@/app/components/design/Address";
import React, { useState } from "react";

export default function AddressSection({
  setAddress,
  setIsAddressOpen,
  addressIsOpen,
  addresses,
  address,
}) {
  return (
    <>
      <button
        className="bg-[#f7f7f7] flex flex-col p-4 rounded-2xl"
        onClick={(e) => setIsAddressOpen(true)}
      >
        <span className="font-bold text-primary">
          {address ? address.name : "آدرس"}
        </span>
        <span className="line-clamp-1 text-right">
          {address ? address.address : "لطفا یک آدرس انتخاب کنید"}
        </span>
      </button>
      <Address
        setAddress={setAddress}
        setIsOpen={setIsAddressOpen}
        addresses={addresses}
        isOpen={addressIsOpen}
      />
    </>
  );
}
