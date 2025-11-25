"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Logout from "../components/design/Logout";
import { Edit, CogIcon } from "lucide-react"; // Edit2 را حذف کردم چون استفاده نشده بود

export default function Header({ hasPermission }) {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  if (status === "loading") {
    return (
      <div className="p-4 mt-4 mb-4 rounded-2xl bg-white mx-8">
        در حال بارگذاری...
      </div>
    );
  }

  return (
    <div className="p-4 mt-4 mb-4 rounded-2xl bg-white mx-4 sm:mx-8">
      <div className="flex justify-between w-full items-center">
        <Image
          width={80}
          height={80}
          src="/logo.webp"
          alt="لوگو"
          className="sm:w-24 sm:h-24"
        />

        {/* دسکتاپ ویو */}
        <div className="hidden sm:flex items-center gap-2">
          <Link href="/profile" className="text-gray-700 hover:text-blue-500">
            <Edit />
          </Link>
          <span className="text-sm sm:text-base">
            {session?.result?.firstname || "نام"}{" "}
            {session?.result?.lastname || "خانوادگی"}
          </span>
          <span className="w-10 h-10 flex justify-center items-center bg-gray-200 rounded-full font-bold">
            {session?.result?.firstname?.charAt(0) || "ن"}{" "}
            {session?.result?.lastname?.charAt(0) || "خ"}
          </span>
          <Logout />
          {hasPermission && (
            <Link
              href="/admin"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              مدیریت
            </Link>
          )}
        </div>

        {/* موبایل ویو */}
        <div className="flex sm:hidden items-center gap-2">
          <span className="w-10 h-10 flex justify-center items-center bg-gray-200 rounded-full font-bold">
            {session?.result?.firstname?.charAt(0) || "ن"}{" "}
            {session?.result?.lastname?.charAt(0) || "خ"}
          </span>

          <div className="relative">
            <button
              ref={buttonRef}
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {menuOpen && (
              <div
                ref={menuRef}
                className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"
              >
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-gray-700">
                    {session?.result?.firstname || "نام"}{" "}
                    {session?.result?.lastname || "خانوادگی"}
                  </div>
                  <div className="border-t border-gray-100"></div>

                  {hasPermission && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)} // بستن منو با کلیک
                    >
                      <div className="flex items-center gap-2">
                        <CogIcon size={20} />
                        <span>مدیریت</span>
                      </div>
                    </Link>
                  )}

                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setMenuOpen(false)} // بستن منو با کلیک
                  >
                    <div className="flex items-center gap-2">
                      <Logout />
                      <span>خروج</span>
                    </div>
                  </button>

                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setMenuOpen(false)} // بستن منو با کلیک
                  >
                    <div className="flex items-center gap-2">
                      <Edit size={20} />
                      <span>ویرایش اطلاعات</span> {/* متن تغییر یافت */}
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
