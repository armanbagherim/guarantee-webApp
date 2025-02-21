import React from "react";

import { TbShare2 } from "react-icons/tb";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { FaTimes } from "react-icons/fa";
import { ImArrowDown } from "react-icons/im";

interface Props {
  closePrompt: () => void;
  doNotShowAgain: () => void;
}

export default function AddToIosSafari(props: Props) {
  const { closePrompt, doNotShowAgain } = props;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[60%] z-50 pb-12 px-4 text-white">
      <div className="relative bg-primary p-4 h-full rounded-xl flex flex-col justify-around items-center text-center">
        <button className="absolute top-0 right-0 p-3" onClick={closePrompt}>
          <FaTimes className="text-2xl" />
        </button>
        <p className="text-lg">
          برای تجربه بهتر استفاده از این سایت می توانید نسخه وب اپ برنامه را نصب
          کنید
        </p>
        <div className="flex gap-2 items-center text-lg">
          <p>روی آیکون</p>
          <TbShare2 className="text-4xl" />
          کلیک کنید
        </div>
        <div className="flex flex-col gap-2 items-center text-lg w-full px-4">
          <p>اسکرول کنید و روی دکمه زیر کلیک کنید</p>
          <div className="bg-zinc-800 flex justify-between items-center w-full px-4 py-2 rounded-lg">
            <p>Add to Home Screen</p>
            <AiOutlinePlusSquare className="text-2xl" />
          </div>
        </div>
        <button className="border-2 p-1" onClick={doNotShowAgain}>
          دیگه نمایش نده
        </button>
        <ImArrowDown className="text-4xl absolute -bottom-[50px] text-white -z-10 animate-bounce" />
      </div>
    </div>
  );
}
