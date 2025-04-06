import React from "react";
import SubmitCardMain from "./SubmitCardMain";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/authOptions";

async function getAdditionalPackages(session) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/guarantee/client/additionalPackages`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    }
  );

  return res.json();
}

export default async function page() {
  const session = await getServerSession(authOptions)
  const { result: packages } = await getAdditionalPackages(
    session
  )
  return (
    <div className="bg-white rounded-3xl h-full flex pt-24 justify-center">
      <div className="w-[400px]">
        <SubmitCardMain packages={packages} />
      </div>
    </div>
  );
}
