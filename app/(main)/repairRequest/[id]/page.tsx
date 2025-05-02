import React from "react";
import CardInfo from "./Modules/CardInfo";
import RequestForm from "./Modules/RequestForm";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";


async function getData(id: string, session) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/guarantee/admin/normalGuarantees/${id}`, {
    headers: {
      Authorization: `Bearer ${session.token}`
    }
  })
  const data = await res.json()
  if (!data) notFound()
  return data
}

async function getRequestTypes(session) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/guarantee/client/requestTypes`, {
    headers: {
      Authorization: `Bearer ${session.token}`
    }
  })
  const data = await res.json()
  if (!data) notFound()
  return data
}


export default async function RepairRequest({ params }) {
  const session = await getServerSession(authOptions);
  const { result: data } = await getData(params.id, session)
  const { result: requestTypes } = await getRequestTypes(session)
  console.log(data)
  return (
    <div className="">
      <div className="mb-4">
        <CardInfo
          cardNumber={data?.id}
          product={`${data.productType?.title} ${data.variant?.title} ${data.guaranteePeriod?.title}`}
        />
      </div>
      <RequestForm guarantee={data} requestTypes={requestTypes} session={session} />
    </div>
  );
}
