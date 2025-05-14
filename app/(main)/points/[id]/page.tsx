import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { LeftArrow } from "@/app/components/design/icons";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

async function getData(session, params) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/guarantee/client/histories/requestId/${params.id}?sortOrder=ASC`,
        {
            cache: "no-store",
            headers: {
                Authorization: `Bearer ${session.token}`,
            },
        }
    );
    if (res.status === 404) {
        return notFound();
    }
    return res.json();
}

export default async function RequestHistory({ params }) {
    const session = await getServerSession(authOptions);
    const { result: historyItems } = await getData(session, params);

    return (
        <div className="mt-4 md:mt-8 md:px-0">

            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl md:text-2xl font-bold">تاریخچه درخواست</h1>
                <Link className="bg-white p-4 rounded-lg cursor-pointer" href={`/requests`}><LeftArrow /></Link>
            </div>
            <div className="space-y-4 md:space-y-6">
                {historyItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg shadow p-4 md:p-6">
                        <div className="flex flex-col gap-3 md:gap-4">
                            {/* Timeline Header (Mobile) */}
                            <div className="flex justify-between items-start md:hidden">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-2 h-2 rounded-full mt-1 min-w-[8px]"
                                        style={{ backgroundColor: item.nodeCommandColor }}
                                    ></div>
                                    <h3 className="font-semibold text-gray-800 text-sm">
                                        {item.nodeCommand}
                                    </h3>
                                </div>
                                <div className="text-xs text-gray-500 text-left">
                                    <p>{new Date(item.createdAt).toLocaleDateString('fa-IR')}</p>
                                    <p>{new Date(item.createdAt).toLocaleTimeString('fa-IR').slice(0, 5)}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                {/* Timeline Dot (Desktop) */}
                                <div className="hidden md:flex flex-col items-center">
                                    <div
                                        className="w-3 h-3 rounded-full mt-1"
                                        style={{ backgroundColor: item.nodeCommandColor }}
                                    ></div>
                                    <div className="w-px h-full bg-gray-200"></div>
                                </div>

                                <div className="flex-1">
                                    {/* Timeline Header (Desktop) */}
                                    <div className="hidden md:block">
                                        <h3 className="font-semibold text-gray-800">
                                            {item.nodeCommand}
                                        </h3>
                                    </div>

                                    {/* Transition Info */}
                                    <div className="mt-1">
                                        <p className="text-xs md:text-sm text-gray-500 flex flex-wrap items-center gap-1 md:gap-2">
                                            <span>از: {item.from}</span>
                                            <span className="hidden md:block"><LeftArrow /></span>
                                            <span className="md:hidden">→</span>
                                            <span>به: {item.to}</span>
                                        </p>
                                    </div>

                                    {/* Description */}
                                    {item.description && (
                                        <p className="text-xs md:text-sm mt-2 bg-gray-50 p-2 md:p-3 rounded-md">
                                            {item.description}
                                        </p>
                                    )}
                                </div>

                                {/* Date (Desktop) */}
                                <div className="hidden md:flex flex-col text-sm text-gray-500 text-left">
                                    <p>تاریخ: {new Date(item.createdAt).toLocaleDateString('fa-IR')}</p>
                                    <p>ساعت: {new Date(item.createdAt).toLocaleTimeString('fa-IR')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {historyItems.length === 0 && (
                <div className="text-center py-8 md:py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-500 text-sm md:text-base">
                        تاریخچه‌ای برای این درخواست ثبت نشده است
                    </p>
                </div>
            )}
        </div>
    );
}