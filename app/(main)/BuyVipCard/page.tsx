import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { getServerSession } from 'next-auth'
import React from 'react'
import BuyVipCardModule from './BuyVipCardModule'


async function getData() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/guarantee/anonymous/vipBundleTypes`, {

    })
    const data = await res.json()
    return data
}


async function getPaymentGateways(session) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/guarantee/client/onlinePaymentGateways`,
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
    const { result: vipCards } = await getData();
    const { result: paymentGateways } = await getPaymentGateways(session);
    return (
        <BuyVipCardModule vipCards={vipCards} session={session} paymentGateways={paymentGateways} />
    )
}
