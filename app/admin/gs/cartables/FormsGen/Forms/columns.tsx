import { fetcher } from "@/app/components/admin-components/fetcher";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Button, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Swal from "sweetalert2";
import GavelIcon from "@mui/icons-material/Gavel";
import concat from "@/app/components/utils/AddressConcat";

export function columns(
  setCurrentSolution,
  currentSolution,
  setIsSolutionOpen
) {

  return [
    {
      accessorKey: "title",
      header: "نام",
    },
    {
      accessorKey: "fee",
      header: "هرینه خدمات",
    },
    {
      accessorKey: "Actions",
      header: "عملیات",

      Cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            onClick={async (e) => {
              setCurrentSolution({
                ...currentSolution,
                solutionName: row.original.title,
                solutionId: row.original.id,
                fee: row.original.fee
              })
              setIsSolutionOpen(false)
            }}
            variant="outlined"
            color="primary"
          >
            انتخاب
          </Button>

        </div>
      ),
    },
  ];
}
