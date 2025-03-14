import React from "react";

import { FaTimes } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { MdAddToHomeScreen } from "react-icons/md";
import { ImArrowUp } from "react-icons/im";

interface Props {
  closePrompt: () => void;
  doNotShowAgain: () => void;
}

export default function AddToMobileChrome(props: Props) {
  const { closePrompt, doNotShowAgain } = props;

  return (
    <div className="fixed top-0 left-0 right-0 h-[60%] z-50 pt-12 px-4 text-white">
      <ImArrowUp className="text-4xl absolute top-[10px] right-[10px] text-indigo-700 z-10 animate-bounce" />
      <div className="relative bg-primary p-4 h-full rounded-xl flex flex-col justify-around items-center text-center">
        <button className="absolute top-0 right-0 p-3" onClick={closePrompt}>
          <FaTimes className="text-2xl" />
        </button>
        <p className="text-lg">
          برای تجربه بهتر استفاده از این سایت می توانید نسخه وب اپ برنامه را نصب
          کنید
        </p>{" "}
        <div className="flex gap-2 items-center text-lg">
          <p>روی آیکون</p>
          <HiDotsVertical className="text-4xl" />
          کلیک کنید
        </div>
        <div className="flex flex-col gap-2 items-center text-lg w-full px-4">
          <p>اسکرول کنید و روی دکمه زیر کلیک کنید</p>
          <div className="bg-zinc-50 flex justify-between items-center w-full px-4 py-2 rounded-lg text-zinc-900">
            <MdAddToHomeScreen className="text-2xl" />
            <p>Add to Home Screen</p>
          </div>
        </div>
        <button className="border-2 p-1" onClick={doNotShowAgain}>
          دیگه نمایش نده
        </button>
      </div>
    </div>
  );
}
