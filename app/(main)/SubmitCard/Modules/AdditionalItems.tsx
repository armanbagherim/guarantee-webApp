import React, { useState } from "react";
import { CheckBox } from "@/app/components/design/icons";


export default function AdditionalItems({ packages, selectedItems, setSelectedItems }) {
  const handleCheck = (itemId: string, price: string) => {
    setSelectedItems((prevState) => {
      const updatedSelection = prevState.some((item) => item.id === itemId)
        ? prevState.filter((item) => item.id !== itemId)
        : [...prevState, { id: itemId, price }];
      return updatedSelection;
    });
  };

  return (
    <div className="flex flex-col bg-[#F9F9F9] p-2 rounded-[30px] mb-2 gap-2">
      {packages.map((item) => (
        <div
          key={item.id}
          onClick={() => handleCheck(item.id, item.price)} // Pass both id and price
          className="flex bg-white px-4 py-4 rounded-[25px] justify-between border-2 border-white transition-all hover:border-green-500 items-center cursor-pointer"
        >
          <div className="flex items-center gap-2 w-full">
            <CheckBox
              checked={selectedItems.some(
                (selectedItem) => selectedItem.id === item.id
              )} // Check if the id is in selectedItems
            />
            <div className="flex flex-col justify-start text-right w-full">
              <div className="flex justify-between items-center mb-2 w-full">
                <span className="font-bold text-primary text-base">
                  {item.title}
                </span>
                <span className="text-green-500 font-bold text-left">
                  {Number(item.price).toLocaleString()} <span className="price"> ءتء</span>
                </span>
              </div>
              <span className="text-[#757575] text-xs">{item.description}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
