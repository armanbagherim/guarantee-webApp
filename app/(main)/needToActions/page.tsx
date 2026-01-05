import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import React from "react";
import NeedToActionList from "./NeedToActionList";

async function getNeedToActions(session) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/guarantee/client/needActions`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    }
  );

  return res.json();
}

export default async function NeedToActionsPage() {
  const session = await getServerSession(authOptions);
  const { result: needToActions } = await getNeedToActions(session);

  return (
    <div className=" mx-auto py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        درخواست‌های نیازمند اقدام
      </h1>

      <NeedToActionList needToActions={needToActions || []} session={session} />
    </div>
  );
}

