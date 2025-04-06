import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

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
    total: data.total // Make sure your API returns total count
  };
}

export default async function UserRequestsList({ searchParams }: { searchParams: { page?: string } }) {
  const session = await getServerSession(authOptions);
  const currentPage = Number(searchParams?.page) || 1;
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const { requests, total } = await getData(session, offset, limit);
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-6">لیست درخواست‌های شما</h1>

      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request.id} className="bg-white rounded-xl shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Request Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">اطلاعات درخواست</h3>
                <div className="mt-2 space-y-2 text-sm">
                  <p><span className="font-medium">شناسه:</span> {request.id}</p>
                  <p><span className="font-medium">نوع:</span> {request.requestType.title}</p>
                  <p><span className="font-medium">دسته‌بندی:</span> {request.requestCategory.title}</p>
                  <p><span className="font-medium">تاریخ ایجاد:</span> {new Date(request.createdAt).toLocaleDateString('fa-IR')}</p>
                </div>
              </div>

              {/* Product Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">اطلاعات محصول</h3>
                <div className="mt-2 space-y-2 text-sm">
                  <p><span className="font-medium">برند:</span> {request.brand.title}</p>
                  <p><span className="font-medium">نوع محصول:</span> {request.productType.title}</p>
                  <p><span className="font-medium">مدل:</span> {request.variant.title}</p>
                  <p><span className="font-medium">کد گارانتی:</span> {request.guaranteeId}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">اطلاعات تماس</h3>
                <div className="mt-2 space-y-2 text-sm">
                  <p><span className="font-medium">شماره تماس:</span> {request.phoneNumber}</p>
                  <p><span className="font-medium">آدرس:</span> {request.address.name}</p>
                  <p className="truncate"><span className="font-medium">محله:</span> {request.address.neighborhood.name}</p>
                  <p><span className="font-medium">شهر:</span> {request.address.city.name}</p>
                </div>
              </div>

              {/* Status & Actions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">وضعیت و عملیات</h3>
                <div className="mt-2 space-y-3">
                  <div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${request.organizationId ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {request.organizationId ? 'تایید شده' : 'در انتظار بررسی'}
                    </span>
                  </div>

                  <Link
                    href={`/requests/${request.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  >
                    مشاهده تاریخچه درخواست
                  </Link>

                  <div className="text-xs text-gray-500">
                    آخرین بروزرسانی: {new Date(request.updatedAt).toLocaleString('fa-IR')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {requests.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">هنوز هیچ درخواستی ثبت نکرده‌اید</p>
          <Link
            href="/new-request"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            ثبت درخواست جدید
          </Link>
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
                  className={`px-4 py-2 border rounded-md ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
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
        نمایش {offset + 1} تا {Math.min(offset + limit, total)} از {total} درخواست
      </div>
    </div>
  );
}