import { fetcher } from "@/app/components/admin-components/fetcher";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Swal from "sweetalert2";

export function columns(
  isEditEav,
  setIsEditEav,
  triggered,
  setTriggered,
  formik,
  setContractsModal
) {
  const getData = async (id: string) => {
    try {
      const res = await fetcher({
        url: `/v1/api/guarantee/admin/superVisorUsers/${id}`,
        method: "GET",
      });
      return res.result;
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteEavType = async (id) => {
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
          url: `/v1/api/guarantee/admin/superVisorUsers/${id}`,
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
      accessorKey: "user",
      header: "نام",
      Cell: ({ row }) => (
        <span>
          {row?.original?.user?.firstname} {row?.original?.user?.lastname}
        </span>
      ),
    },

    {
      accessorKey: "user.phoneNumber",
      header: "شماره موبایل  ",
    },
    {
      accessorKey: "Actions",
      header: "عملیات",

      Cell: ({ row }) => (
        <>
          <IconButton
            onClick={async (e) => {
              const editData = await getData(row.original.id);
              setIsEditEav({ active: true, id: row.original.id, open: true });
              formik.setValues({
                ...formik.values,
                firstname: editData.user.firstname,
                lastname: editData.user.lastname,
                phoneNumber: editData.user.phoneNumber,
                nationalCode: editData.user.nationalCode,
              });
            }}
            aria-label="delete"
            color="primary"
          >
            <ModeEditIcon />
          </IconButton>

          <IconButton
            onClick={async (e) => {
              deleteEavType(row.original.id)
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
