import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import FactorDetail from "../../FactorDetail";

async function getFactorDetails(id: string) {
    const session = await getServerSession(authOptions);

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/guarantee/cartable/factors/${id}`,
        {
            cache: "no-store",
            headers: {
                Authorization: `Bearer ${session?.token}`,
            },
        }
    );

    if (res.status === 404) {
        return notFound();
    }

    return await res.json();
}

export default async function FactorDetailsPage({ params }: { params: { id: string } }) {
    const { result: factor } = await getFactorDetails(params.id);



    return (
        <FactorDetail factor={factor} />
    );
}