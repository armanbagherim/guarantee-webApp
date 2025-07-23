import React from 'react'
import EditProfileModule from './EditProfileModule'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import ClientSessionProvider from './SessionProviders'

export default async function EditProfile() {
    const session = await getServerSession(authOptions)
    return (
        <div><ClientSessionProvider session={session}><EditProfileModule session={session} /></ClientSessionProvider></div>
    )
}
