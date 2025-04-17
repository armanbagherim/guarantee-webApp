import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { FaPrint } from "react-icons/fa";

async function getData(session, offset = 0, limit = 10) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/guarantee/client/factors?sortOrder=DESC&offset=${offset}&limit=${limit}&orderBy=id`,
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
  const data = await res.json();
  return {
    factors: data.result,
    total: data.total
  };
}

export default async function UserRequestsList({ searchParams }: { searchParams: { page?: string } }) {
  const session = await getServerSession(authOptions);
  const currentPage = Number(searchParams?.page) || 1;
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const { factors, total } = await getData(session, offset, limit);
  const totalPages = Math.ceil(total / limit);

  // Format price with commas
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' ریال';
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR');
  };

  // Get status text
  const getStatusText = (statusId) => {
    const statusMap = {
      1: 'در انتظار پرداخت',
      2: 'در حال پردازش',
      3: 'پرداخت شده',
      4: 'لغو شده'
    };
    return statusMap[statusId] || 'نامشخص';
  };

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-6">لیست فاکتور های شما</h1>

      <div className="space-y-4">
        {factors?.map((factor) => (
          <div key={factor.id} className="bg-white rounded-xl shadow p-6">
            <div className="flex gap-16 flex-wrap">
              <div className="space-y-1">
                <p className="text-gray-500 text-sm">شماره فاکتور</p>
                <p className="font-medium">#{factor.id}</p>
              </div>

              <div className="flex gap-2">
                <div className="space-y-1">
                  <p className="text-gray-500 text-sm">تاریخ ایجاد</p>
                  <p className="font-medium">{formatDate(factor.createdAt)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500 text-sm">تاریخ پرداخت</p>
                  <p className="font-medium">{formatDate(factor.settlementDate)}</p>
                </div>
              </div>


              <div className="space-y-1">
                <p className="text-gray-500 text-sm">وضعیت</p>
                <p className={`font-medium ${factor.factorStatusId === 3 ? 'text-green-600' :
                  factor.factorStatusId === 4 ? 'text-red-600' : 'text-blue-600'
                  }`}>
                  {getStatusText(factor.factorStatusId)}
                </p>
              </div>


              <div className="space-y-1">
                <p className="text-gray-500 text-sm">مبلغ کل</p>
                <p className="font-medium">{formatPrice(factor.totalPrice)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 text-sm">تعداد آیتم ها</p>
                <p className="font-medium">{factor.factorItems.length}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t flex justify-end items-center">


              <Link
                href={`/factorDetail/client/${factor.id}`}
                className="px-4 py-2 flex gap-2 items-center bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <FaPrint />
                <span>جزيیات کامل و پرینت</span>

              </Link>
            </div>
          </div>
        ))}
      </div>

      {factors.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">هنوز هیچ فاکتوری ثبت نکرده‌اید</p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center gap-2">
            {currentPage > 1 && (
              <Link
                href={`?page=${currentPage - 1}`}
                className="px-4 py-2 border rounded-md hover:bg-gray-100 flex items-center gap-1"
              >
                <span className="relative top-[3px]">→</span>
                <span>قبلی</span>
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
                  className={`px-4 py-2 border rounded-md ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                    }`}
                >
                  {pageNum}
                </Link>
              );
            })}

            {currentPage < totalPages && (
              <Link
                href={`?page=${currentPage + 1}`}
                className="px-4 py-2 border rounded-md hover:bg-gray-100 flex items-center gap-1"
              >
                <span>بعدی</span>
                <span className="relative top-[3px]">←</span>
              </Link>
            )}
          </nav>
        </div>
      )}

      <div className="mt-4 text-center text-sm text-gray-500">
        نمایش {offset + 1} تا {Math.min(offset + limit, total)} از {total} فاکتور
      </div>
    </div>
  );
}