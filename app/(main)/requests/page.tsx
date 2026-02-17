import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import concat from "@/app/components/utils/AddressConcat";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import ClientRequestCard from "./ClientRequestCard";

async function getData(session, offset = 0, limit = 10) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/guarantee/client/requests?sortOrder=DESC&offset=${offset}&limit=${limit}&orderBy=id`,
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
    requests: data.result,
    total: data.total,
  };
}

export default async function UserRequestsList({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const session = await getServerSession(authOptions);
  const currentPage = Number(searchParams?.page) || 1;
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const { requests, total } = await getData(session, offset, limit);
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">لیست درخواست‌های شما</h1>

      {/* Requests List */}
      <div className="space-y-4">
        {requests.map((request) => (
          <ClientRequestCard key={request.id} request={request} token={session.token} />
        ))}
      </div>

      {/* Empty State */}
      {requests.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 text-lg">هنوز هیچ درخواستی ثبت نکرده‌اید</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              href="/normalCards"
              className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              ثبت درخواست خارج از گارانتی
            </Link>
            <Link
              href="/outOfWarranty"
              className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              ثبت درخواست تعمیر
            </Link>
            <Link
              href="/vipCards"
              className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              ثبت درخواست VIP
            </Link>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center gap-2">
            {currentPage > 1 && (
              <Link
                href={`?page=${currentPage - 1}`}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-1"
              >
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
                  className={`px-4 py-2 border rounded-md text-sm font-medium ${currentPage === pageNum
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                    } transition-colors duration-200`}
                >
                  {pageNum}
                </Link>
              );
            })}

            {currentPage < totalPages && (
              <Link
                href={`?page=${currentPage + 1}`}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-1"
              >
                <span>بعدی</span>
              </Link>
            )}
          </nav>
        </div>
      )}

      {/* Pagination Summary */}
      {total > 0 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          نمایش {offset + 1} تا {Math.min(offset + limit, total)} از {total} درخواست
        </div>
      )}
    </div>
  );
}