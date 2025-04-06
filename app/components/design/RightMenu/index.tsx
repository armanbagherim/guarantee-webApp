"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation"; // Import usePathname to get current path
import {
  Cards,
  CloseMenu,
  Complaint,
  DashboardIcon,
  Menu,
  Notifications,
  Payments,
  Requests,
} from "../icons";
import Link from "next/link";

export default function RightMenu({ requestsCount, notificationCount }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href;
  };

  const openMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button className="lg:hidden mt-8" onClick={openMenu}>
        <Menu />
      </button>
      <div
        onClick={openMenu}
        className={`fixed ${isOpen ? "block" : "hidden"
          } z-20 bg-black/20 top-0 md:hidden right-0 backdrop:blur-lg left-0 bottom-0`}
      ></div>
      <div
        className={`px-8 bg-white py-8 h-full transform-gpu  ${isOpen ? "translate-x-[0]" : "translate-x-[400px]"
          } lg:block transition-all lg:w-full w-[300px] lg:relative lg:translate-x-[0] fixed right-0 z-[99] top-0 bottom-0 h-full lg:rounded-[35px]`}
      >
        <span className="md:hidden absolute top-3 right-5 cursor-pointer" onClick={e => setIsOpen(false)}><CloseMenu /></span>
        <ul className="flex flex-col gap-8 pt-10 md:pt-0">
          <Link onClick={(e) => setIsOpen(false)} href="/">
            <li
              className={`flex gap-4 font-bold text-xs text-[#606C80] ${isActive("/") ? "text-blue-500" : "text-gray-500"
                }`}
            >
              <DashboardIcon color={isActive("/") ? "#3B82F6" : "#6F6F6F"} />
              <span>داشبورد</span>
            </li>
          </Link>
          <Link onClick={(e) => setIsOpen(false)} href="#">
            <li
              className={`flex gap-4 font-bold text-xs text-[#606C80] ${isActive("#") ? "text-blue-500" : "text-gray-500"
                }`}
            >
              <Payments color={isActive("#") ? "#3B82F6" : "#6F6F6F"} />
              <span>پرداخت ها</span>
            </li>
          </Link>
          <Link onClick={(e) => setIsOpen(false)} href="/normalCards">
            <li
              className={`flex gap-4 font-bold text-xs text-[#606C80] ${isActive("/normalCards") ? "text-blue-500" : "text-gray-500"
                }`}
            >
              <Cards color={isActive("/normalCards") ? "#3B82F6" : "#6F6F6F"} />
              <span>کارت های گارانتی</span>
            </li>
          </Link>
          <Link onClick={(e) => setIsOpen(false)} href="#">
            <li
              className={`flex gap-4 font-bold text-xs text-[#606C80] ${isActive("#") ? "text-blue-500" : "text-gray-500"
                }`}
            >
              <Cards color={isActive("#") ? "#3B82F6" : "#6F6F6F"} />
              <span>کارت های VIP</span>
            </li>
          </Link>
          <Link onClick={(e) => setIsOpen(false)} href="/outOfWarranty">
            <li
              className={`flex gap-4 font-bold text-xs text-[#606C80] ${isActive("/outOfWarranty") ? "text-blue-500" : "text-gray-500"
                }`}
            >
              <Requests color={isActive("/outOfWarranty") ? "#3B82F6" : "#6F6F6F"} />
              <span>درخواست خارج از گارانتی</span>
            </li>
          </Link>
          <Link onClick={(e) => setIsOpen(false)} href="/requests">
            <li
              className={`flex gap-4 font-bold text-xs text-[#606C80] ${isActive("#") ? "text-blue-500" : "text-gray-500"
                }`}
            >
              <Requests color={isActive("#") ? "#3B82F6" : "#6F6F6F"} />
              <span>درخواست ها</span>
            </li>
          </Link>

          <Link onClick={(e) => setIsOpen(false)} href="#">
            <li
              className={`flex gap-4 font-bold text-xs text-[#606C80] ${isActive("#") ? "text-blue-500" : "text-gray-500"
                }`}
            >
              <Complaint color={isActive("#") ? "#3B82F6" : "#6F6F6F"} />
              <span>شکایات</span>
            </li>
          </Link>
          <Link onClick={(e) => setIsOpen(false)} href="#">
            <li
              className={`flex gap-4 font-bold text-xs text-[#606C80] ${isActive("#") ? "text-blue-500" : "text-gray-500"
                }`}
            >
              <Notifications color={isActive("#") ? "#3B82F6" : "#6F6F6F"} />
              <span>اطلاع رسانی ها</span>
            </li>
          </Link>
          <Link onClick={(e) => setIsOpen(false)} href="#">
            <li
              className={`flex gap-4 font-bold text-xs text-[#606C80] ${isActive("#") ? "text-blue-500" : "text-gray-500"
                }`}
            >
              <Complaint color={isActive("#") ? "#3B82F6" : "#6F6F6F"} />
              <span>پشتیبانی</span>
            </li>
          </Link>
        </ul>
      </div>
    </>
  );
}
