"use client";
import React from "react";
import Modal from "../Modal";

export default function Address({ setAddress, addresses, isOpen, setIsOpen }) {
  return (
    <Modal isOpen={isOpen} handleClose={setIsOpen}>
      <div className="bg-white rounded-[25px]">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => {
              setIsOpen(false);
              setAddress(null);
            }}
            className="bg-primary text-white p-2 rounded-2xl w-full block text-sm py-4"
          >
            افزودن آدرس جدید
          </button>
        </div>
        <div>
          {addresses.map((address, index) => (
            <div
              key={index}
              onClick={() => {
                setAddress(address);
                setIsOpen(false);
              }}
              className="bg-gray-100 p-4 rounded-[20px] mb-4 cursor-pointer"
            >
              <h1 className="text-md font-bold">{address.name}</h1>
              <p>{address.address}</p>
              <p>کد پستی: {address.postalCode}</p>
              <p>شهر: {address.city}</p>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
