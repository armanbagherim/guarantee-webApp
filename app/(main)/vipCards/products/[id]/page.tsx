import React from 'react'
import AssignProducts from './assignProducts'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'

export default async function AssignProductsPage() {
    const session = await getServerSession(authOptions)
    return (
        <AssignProducts token={session} />
    )
}
