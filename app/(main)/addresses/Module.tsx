"use client";
import { fetcher } from "@/app/components/admin-components/fetcher";
import NewAddress from "@/app/components/design/NewAddress";
import concat from "@/app/components/utils/AddressConcat";
import React, { useEffect, useState } from "react";
import { FaEdit, FaPencilAlt, FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

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

  const deleteAddress = async (id) => {
    try {
      const result = await Swal.fire({
        title: "مطمئن هستید؟",
        text: "با حذف این گزینه امکان بازگشت آن وجود ندارد",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "بله حذفش کن",
        cancelButtonText: "لغو",
      });

      if (result.isConfirmed) {
        const req = await fetcher({
          url: `/v1/api/guarantee/client/addresses/${id}`,
          method: "DELETE",
        });
        toast.success("موفق");
        getAddresses()
      }
    } catch (error) {
      toast.error(error.message);
    }
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {addressLoading ? (
            <>
              <div className="h-[110px] bg-gray-300 w-full animate-pulse rounded-3xl"></div>
              <div className="h-[110px] bg-gray-300 w-full animate-pulse rounded-3xl"></div>
              <div className="h-[110px] bg-gray-300 w-full animate-pulse rounded-3xl"></div>
              <div className="h-[110px] bg-gray-300 w-full animate-pulse rounded-3xl"></div>
              <div className="h-[110px] bg-gray-300 w-full animate-pulse rounded-3xl"></div>
              <div className="h-[110px] bg-gray-300 w-full animate-pulse rounded-3xl"></div>
            </>
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
                      className="cursor-pointer"
                      onClick={(e) => {
                        setActiveAddress(address);
                        setIsNewAddressOpen(true);
                      }}
                    >
                      <FaPencilAlt className="text-primary" />
                    </span>
                    <span className="cursor-pointer" onClick={(e) => deleteAddress(address.id)}><FaTrash className="text-red-600" /></span>
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
