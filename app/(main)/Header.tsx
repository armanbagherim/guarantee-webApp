"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Logout from "../components/design/Logout";
import { Edit, Edit2 } from "lucide-react";

export default function Header({ hasPermission }) {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <div className="p-4 mt-4 mb-4 rounded-2xl bg-white mx-8">در حال بارگذاری...</div>;
    }

    return (
        <div className="p-4 mt-4 mb-4 rounded-2xl bg-white mx-8">
            <div className="flex justify-between w-full items-center">
                <Image width={100} height={100} src="/logo.webp" alt="لوگو" />
                <div className="flex items-center gap-2">
                    <Link href="/profile" className="text-gray-700 hover:text-blue-500">
                        <Edit />
                    </Link>
                    <span>
                        {session?.result?.firstname || "نام"} {session?.result?.lastname || "خانوادگی"}
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
            </div>
        </div>
    );
}