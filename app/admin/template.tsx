"use client";

import SideMenu from "./components/SideMenu";
import "./../globals.scss";
import { useAtom } from "jotai";
import { pageTitle } from "./layout";
import Link from "next/link";

export default function Template({ children }: { children: React.ReactNode }) {
  const [atom] = useAtom(pageTitle);
  return (
    <div>
      <SideMenu />
      <div className=" sm:mr-72 print:p-0 print:m-0 print:w-full print:mr-0">
        <div className="flex justify-between items-center h-20 bg-white px-4 no-print mx-4 md:mx-8 rounded-2xl mt-4 md:mt-12">
          <div className="text-lg font-bold text-blue-700">{atom.title}</div>
          {atom?.buttonTitle && atom.onClick ? (
            <button
              onClick={atom.onClick}
              className="bg-blue-700 text-white px-8 hover:bg-transparent hover:border hover:border-blue-700 hover:text-blue-700 transition-all py-3 border border-transparent rounded-2xl"
            >
              {atom.buttonTitle}
            </button>
          ) : atom?.buttonTitle ? (
            <Link
              className="bg-blue-700 text-white px-8 hover:bg-transparent hover:border hover:border-blue-700 hover:text-blue-700 transition-all py-3 border border-transparent rounded-2xl"
              href={atom.link ?? ""}
            >
              {atom.buttonTitle}
            </Link>
          ) : null}
        </div>
      </div>
      <div className="px-4 md:px-10 py-6 pb-36 sm:mr-72 print:p-0 print:m-0 print:w-full print:mr-0 ">
        <div className="mb-16">{children}</div>
      </div>
    </div>
  );
}
