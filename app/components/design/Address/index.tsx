"use client";
import React, { useState } from "react";
import Modal from "../Modal";
import NewAddress from "../NewAddress";
import concat from "../../utils/AddressConcat";
import { DialogActions } from "@mui/material";

export default function Address({
  setAddress,
  allAddresess,
  isOpen,
  setIsOpen,
  refetch,
  addressLoading,
}) {
  const [isNewAddressOpen, setIsNewAddressOpen] = useState(false);
  return (
    <>
      <NewAddress

        refetch={refetch}
        handleClose={(e) => setIsNewAddressOpen(false)}
        isOpen={isNewAddressOpen}
        setIsNewAddressOpen={setIsNewAddressOpen}
      />

      <Modal isOpen={isOpen} handleClose={(e) => setIsOpen(false)}>
        <div className="bg-white rounded-[25px]">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => {
                // setIsOpen(false);
                setIsNewAddressOpen(true);
              }}
              className="bg-primary text-white p-2 rounded-2xl w-full block text-sm py-4"
            >
              افزودن آدرس جدید
            </button>
          </div>
          <div>
            {addressLoading ? (
              <div className="h-[110px] bg-gray-300 w-full animate-pulse rounded-3xl"></div>
            ) : (
              allAddresess?.map((address, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setAddress(address);
                    setIsOpen(false);
                  }}
                  className="bg-gray-100 p-4 rounded-[20px] mb-4 cursor-pointer"
                >
                  <h1 className="text-md font-bold">{address.name}</h1>
                  <p>{concat(address)}</p>
                  {/* <p>کد پستی: {address.postalCode}</p>
                <p>شهر: {address.city}</p> */}
                </div>
              ))
            )}
          </div>
        </div>
        <DialogActions>
          <button
            onClick={() => {
              setIsOpen(false);
            }
            }
            className="bg-red-500 text-white p-2 rounded-2xl w-full block text-sm py-4"
          >
            بستن
          </button>
        </DialogActions>
      </Modal>
    </>
  );
}
