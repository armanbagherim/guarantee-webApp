import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Cart from "@/app/components/design/Cart";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

async function getData(session, offset = 0, limit = 10) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/guarantee/client/normalGuarantee/myGuarantees?offset=${offset}&limit=${limit}`,
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

export default async function NormalCards({ searchParams }) {
  const session = await getServerSession(authOptions);
  const currentPage = Number(searchParams?.page) || 1;
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const { result: guarantees, total } = await getData(session, offset, limit);
  const totalPages = Math.ceil(total / limit);

  console.log(session);
  console.log(guarantees);
  return (
    <div className="">
      <div className="bg-white mb-4 p-4 rounded-2xl flex justify-between items-center">
        <span className="font-bold text-gray-600">کارت های گارانتی عادی</span>
        <Link
          className="bg-primary py-4 px-4 rounded-xl text-white text-sm"
          href="/SubmitCard"
        >
          ثبت کارت گارانتی جدید
        </Link>
      </div>

      <div className="grid 2xl::grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4">
        {guarantees.map((value, key) => (
          <div key={key} className="">
            <div className="mb-2">
              <Cart
                data={value}
                color={
                  new Date(value.endDate) > new Date() ? `#039a0b` : `#5E5E5E`
                }
              />
            </div>
            <div className="flex relative -top-8 gap-2">
              {new Date(value.endDate) > new Date() && (
                <Link
                  href={`/repairRequest/${value.id}`}
                  className="bg-white border border-primary block text-center p-4 text-primary rounded-2xl font-bold text-sm w-full"
                >
                  ثبت درخواست تعمیر
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8 gap-2">
        {currentPage > 1 && (
          <Link
            href={`?page=${currentPage - 1}`}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            قبلی
          </Link>
        )}

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Link
            key={page}
            href={`?page=${page}`}
            className={`px-4 py-2 rounded-md ${
              currentPage === page
                ? "bg-primary text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {page}
          </Link>
        ))}

        {currentPage < totalPages && (
          <Link
            href={`?page=${currentPage + 1}`}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            بعدی
          </Link>
        )}
      </div>
    </div>
  );
}
