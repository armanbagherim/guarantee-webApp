import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { ConvertToNull } from "./ConvertToNull"; // Adjust the import path as needed

async function getData(session, offset = 0, limit = 10) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/guarantee/client/userPoints?sortOrder=DESC&offset=${offset}&limit=${limit}&orderBy=id`,
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
    points: data.result,
    total: data.total // Assumes API returns total count
  };
}

export default async function UserPointsList({ searchParams }) {
  const session = await getServerSession(authOptions);
  const currentPage = Number(searchParams?.page) || 1;
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const { points, total } = await getData(session, offset, limit);
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">لیست امتیازات شما</h1>

      <div className="space-y-4">
        {points.map((point) => (
          <div key={point.id} className="bg-white rounded-xl shadow p-4">
            <div className="flex gap-4 justify-between items-center">
              {/* Point Info */}
              <div>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">عنوان:</span> {point.point.title}</p>
                </div>
              </div>

              <div>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">امتیاز:</span> {point.pointScore}</p>

                </div>
              </div>

              {/* Date Info */}
              <div>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">تاریخ کسب:</span> {new Date(point.createdAt).toLocaleDateString('fa-IR')}</p>
                </div>
              </div>

              {/* Actions */}

            </div>
          </div>
        ))}
      </div>

      {points.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">هنوز هیچ امتیازی کسب نکرده‌اید</p>
          <Link
            href="/surveys"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            شرکت در نظرسنجی
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
        نمایش {offset + 1} تا {Math.min(offset + limit, total)} از {total} امتیاز
      </div>
    </div>
  );
}