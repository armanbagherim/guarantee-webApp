"use client";
import { fetcher } from "@/app/components/admin-components/fetcher";
import NewAddress from "@/app/components/design/NewAddress";
import concat from "@/app/components/utils/AddressConcat";
import React, { useEffect, useState } from "react";

export default function UserAddressesModule() {
  const [address, setAddress] = useState(null);
  const [allAddresess, setAllAddress] = useState(null);
  const [addressIsOpen, setIsAddressOpen] = useState(false);
  const [isNewAddressOpen, setIsNewAddressOpen] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [activeAddress, setActiveAddress] = useState(null);
  const getAddresses = async () => {
    setAddressLoading(true);
    const result = await fetcher({
      url: "/v1/api/guarantee/client/addresses",
      method: "GET",
    });
    setAllAddress(result?.result);
    setAddressLoading(false);
  };

  useEffect(() => {
    getAddresses();
  }, []);

  return (
    <div className="mt-8">
      <div className="">
        <NewAddress
          refetch={getAddresses}
          handleClose={(e) => setIsNewAddressOpen(false)}
          isOpen={isNewAddressOpen}
          setIsNewAddressOpen={setIsNewAddressOpen}
          edit={activeAddress}
        />
        <div className="grid grid-cols-3 gap-4">
          {addressLoading ? (
            <div className="h-[110px] bg-white w-full animate-pulse rounded-3xl"></div>
          ) : (
            allAddresess?.map((address, index) => (
              <div
                key={index}
                onClick={() => {
                  // setIsOpen(false);
                }}
                className="bg-white p-4 rounded-[20px] mb-4"
              >
                <div className="flex justify-between">
                  <h1 className="text-md font-bold text-primary">
                    {address.name}
                  </h1>
                  <div className="flex gap-4">
                    <span
                      onClick={(e) => {
                        setActiveAddress(address);
                        setIsNewAddressOpen(true);
                      }}
                    >
                      Edit
                    </span>
                    <span>Delete</span>
                  </div>
                </div>
                <p>{concat(address)}</p>
                {/* <p>کد پستی: {address.postalCode}</p>
                <p>شهر: {address.city}</p> */}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
