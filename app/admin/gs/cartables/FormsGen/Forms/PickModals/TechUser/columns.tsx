import { fetcher } from "@/app/components/admin-components/fetcher";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, IconButton, Tooltip } from "@mui/material";
import Swal from "sweetalert2";
import HistoryIcon from "@mui/icons-material/History";
import AdjustIcon from "@mui/icons-material/Adjust";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

export function columns(
    setOrganId,
    setOrganOpen
) {
    return [
        {
            accessorKey: "fullName",
            header: "نام",
            size: 10, //small column
            maxSize: 10,
        },

        {
            accessorKey: "Actions",
            header: "عملیات",
            size: 20,
            maxSize: 20,
            Cell: ({ row }) => (
                <div className="flex gap-2">
                    <Tooltip placement="top" title={`انتخاب`}>
                        <button
                            className="px-2 py-2 text-xs font-bold bg-pink-100 hover:bg-pink-900 hover:text-white transition-all text-pink-600 rounded-lg"
                            onClick={async (e) => {
                                setOrganId(row.original.id);
                                setOrganOpen((prev) => ({
                                    ...prev,
                                    value: row.original.fullName,
                                    isOpen: false,
                                }));
                            }}
                        >
                            <CheckBoxOutlineBlankIcon />
                        </button>
                    </Tooltip>

                </div>
            ),
        },
    ];
}
