import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Cart from "@/app/components/design/Cart";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

async function getData(session) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/guarantee/client/normalGuarantee/myGuarantees`,
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

export default async function NormalCards() {
  const session = await getServerSession(authOptions);
  const { result: guarantees } = await getData(session);
  console.log(session)
  return (
    <div className="mt-8">
      <div className="grid 2xl::grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4">
        {guarantees.map((value, key) => {
          return (
            <div key={key} className="">
              <div className="mb-2">
                <Cart
                  data={value}
                  color={
                    new Date(value.endDate) > new Date() ? `#039a0b` : `#5E5E5E`
                  }
                />
              </div>
              {new Date(value.endDate) > new Date() && (
                <Link
                  href={`/repairRequest/${value.id}`}
                  className="bg-white border border-primary relative -top-8 block text-center p-4 text-primary rounded-2xl font-bold text-sm w-full"
                >
                  ثبت درخواست تعمیر
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
