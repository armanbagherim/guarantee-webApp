import LightDataGrid from '@/app/components/admin-components/LightDataGrid/LightDataGrid'
import React from 'react'
import { columns } from './columns'

export default function PickTechUserModal({ setOrganId, url, setOrganOpen }) {
    const [triggered, setTriggered] = React.useState(false)
    return (
        <LightDataGrid
            triggered={triggered}
            url={url}
            columns={columns(
                setOrganId,
                setOrganOpen
            )}
        />
    )
}
