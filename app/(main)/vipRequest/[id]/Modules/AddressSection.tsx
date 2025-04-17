"use client";
import Address from "@/app/components/design/Address";
import concat from "@/app/components/utils/AddressConcat";
import React, { useState } from "react";

export default function AddressSection({
  setAddress,
  setIsAddressOpen,
  addressIsOpen,
  allAddresess,
  address,
  refetch,
  addressLoading,
}) {
  return (
    <>
      <button
        className="bg-[#f7f7f7] flex flex-col p-4 rounded-2xl"
        onClick={(e) => setIsAddressOpen(true)}
      >
        <span className="font-bold text-primary text-right mb-2">
          {address ? address.name : "آدرس"}
        </span>
        <span className="line-clamp-1 text-right text-xs">
          {address ? concat(address) : "لطفا یک آدرس انتخاب کنید"}
        </span>
      </button>
      <Address
        refetch={refetch}
        setAddress={setAddress}
        setIsOpen={setIsAddressOpen}
        allAddresess={allAddresess}
        isOpen={addressIsOpen}
        addressLoading={addressLoading}
      />
    </>
  );
}
