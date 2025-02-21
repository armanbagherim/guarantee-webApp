import { log } from "console";
import { redirect } from "next/dist/server/api-utils";
import React from "react";

export default function SaveBar({ action, backUrl = "" }) {
  return (
    <div className="fixed bottom-0 left-0 px-8 py-4  bg-slate-50 border-t w-full text-left z-10">
      <button
        type="submit"
        // onClick={() => window.location.replace(backUrl)}
        className="!border-red-700 mr-1 ml-1 outline-none text-red-700 px-6 hover:bg-transparent hover:border hover:border-red-700 hover:text-red-700 transition-all py-2 border border-transparent rounded-xl"
      >
        انصراف
      </button>
      <button
        onClick={action}
        className="!border-blue-700 mr-1 ml-1 outline-none text-blue-700 px-6 hover:bg-transparent hover:border hover:border-blue-700 hover:text-blue-700 transition-all py-2 border border-transparent rounded-xl"
      >
        ذخیره
      </button>
    </div>
  );
}
