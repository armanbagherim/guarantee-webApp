import { fetcher } from "@/app/components/admin-components/fetcher";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Swal from "sweetalert2";
import GavelIcon from "@mui/icons-material/Gavel";

export function columns(
  triggered,
  setTriggered,
) {


  const deleteItem = async (id) => {
    try {
      const result = await Swal.fire({
        title: "مطمئن هستید؟",
        text: "با حذف این گزینه امکان بازگشت آن وجود ندارد",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "بله حذفش کن",
        cancelButtonText: "لغو",
      });

      if (result.isConfirmed) {
        const req = await fetcher({
          url: `/v1/api/guarantee/admin/guaranteeOrganizationContracts/${id}`,
          method: "DELETE",
        });
        toast.success("موفق");
        setTriggered(!triggered);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return [
    {
      accessorKey: "representativeShare",
      header: "درصد نماینده",
    },

    {
      accessorKey: "startDate",
      header: "تاریخ شروع",
      Cell: ({ row }) => (
        <span>
          {new Date(row?.original?.startDate).toLocaleDateString('fa-IR')}
        </span>
      ),
    },

    {
      accessorKey: "endDate",
      header: "تاریخ پایان",
      Cell: ({ row }) => (
        <span>
          {new Date(row?.original?.endDate).toLocaleDateString('fa-IR')}
        </span>
      ),
    },

    {
      accessorKey: "Actions",
      header: "عملیات",

      Cell: ({ row }) => (
        <>

          <IconButton
            onClick={async (e) => {
              deleteItem(row.original.id)
            }}
            aria-label="delete"
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];
}
