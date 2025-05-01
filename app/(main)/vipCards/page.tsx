import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Cart from "@/app/components/design/Cart";
import VipCard from "@/app/components/design/Cart/Vip";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

async function getData(session, offset = 0, limit = 10) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/guarantee/client/vipGuarantees/myGuarantees?offset=${offset}&limit=${limit}`,
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

export default async function VipCards({ searchParams }) {
  const session = await getServerSession(authOptions);
  const currentPage = Number(searchParams?.page) || 1;
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const { result: guarantees, total } = await getData(session, offset, limit);
  const totalPages = Math.ceil(total / limit);

  console.log(session);

  return (
    <div className="">
      <div className="bg-white mb-4 p-4 rounded-2xl flex justify-between items-center">
        <span className="font-bold text-gray-600">کارت های گارانتی VIP</span>
        <Link className="bg-primary py-4 px-4 rounded-xl text-white text-sm" href="/SubmitCard">
          ثبت کارت گارانتی جدید
        </Link>
      </div>

      <div className="grid 2xl::grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4">
        {guarantees.map((value, key) => (
          <div key={key} className="">
            <div className="mb-2">
              <VipCard data={value} />
            </div>
            <div className="flex relative -top-8 gap-2">
              {new Date(value.endDate) > new Date() && (
                <div className="flex items-center gap-2 justify-between w-full">
                  <Link
                    href={`/vipRequest/${value.id}`}
                    className="bg-white border border-primary flex-1 block text-center p-4 text-primary rounded-2xl font-bold text-sm w-full"
                  >
                    ثبت درخواست تعمیر
                  </Link>
                  <Link
                    href={`/vipCards/products/${value.id}`}
                    className="bg-white border border-primary flex-1 block text-center p-4 text-primary rounded-2xl font-bold text-sm w-full"
                  >
                    محصولات
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          {currentPage > 1 && (
            <Link
              href={`?page=${currentPage - 1}`}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              قبلی
            </Link>
          )}

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            return (
              <Link
                key={pageNum}
                href={`?page=${pageNum}`}
                className={`px-4 py-2 rounded-md ${currentPage === pageNum
                    ? 'bg-primary text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {pageNum}
              </Link>
            );
          })}

          {currentPage < totalPages && (
            <Link
              href={`?page=${currentPage + 1}`}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              بعدی
            </Link>
          )}
        </div>
      )}
    </div>
  );
}