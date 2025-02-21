import React, { useState } from "react";
import { CheckBox } from "@/app/components/design/icons";

interface Item {
  id: string;
  title: string;
  description: string;
  price: string;
}

const items: Item[] = [
  {
    id: "1",
    title: "گارانتی شکستگی کالا",
    description:
      "با خرید این آیتم هرگونه شکستگی که خارج از شرایط گارانتی باشد را می توانید رایگان انجام دهید",
    price: "120000",
  },
  {
    id: "2",
    title: "گارانتی محصول اضافی",
    description: "خدمات بیشتر برای محصول شما.",
    price: "80000",
  },
  {
    id: "3",
    title: "گارانتی تعویض محصول",
    description: "تعویض کالا در صورت خرابی.",
    price: "150000",
  },
];

export default function AdditionalItems() {
  const [selectedItems, setSelectedItems] = useState<
    { id: string; price: string }[]
  >([]);

  const handleCheck = (itemId: string, price: string) => {
    setSelectedItems((prevState) => {
      const updatedSelection = prevState.some((item) => item.id === itemId)
        ? prevState.filter((item) => item.id !== itemId)
        : [...prevState, { id: itemId, price }];
      return updatedSelection;
    });
  };

  console.log(selectedItems); // Log the selected items for debugging

  return (
    <div className="flex flex-col bg-[#F9F9F9] p-2 rounded-[30px] mb-2 gap-2">
      {items.map((item) => (
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
                  {item.price} <span className="price"> ءتء</span>
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
