import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Cart from "@/app/components/design/Cart";
import VipCard from "@/app/components/design/Cart/Vip";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

async function getData(session) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/guarantee/client/vipGuarantees/myGuarantees`,
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
    <div className="">
      <div className="bg-white mb-4 p-4 rounded-2xl flex justify-between items-center">
        <span className="font-bold text-gray-600">کارت های گارانتی VIP</span>
        <Link className="bg-primary py-4 px-4 rounded-xl text-white text-sm" href="/SubmitCard">ثبت کارت گارانتی جدید</Link>
      </div>
      <div className="grid 2xl::grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4">
        {guarantees.map((value, key) => {
          return (
            <div key={key} className="">
              <div className="mb-2">
                <VipCard
                  data={value}

                />
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
          );
        })}
      </div>
    </div>
  );
}
