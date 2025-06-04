import { Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Uploader from "@/app/components/admin-components/Uploader";
import { fetcher } from "@/app/components/admin-components/fetcher";
import Loading from "@/app/components/admin-components/loading";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import toast from "@/app/components/toast";
import Image from "next/image";
import { Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Swal from "sweetalert2";
import SubjectIcon from "@mui/icons-material/Subject";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

export function columns(
  isEditEav,
  setIsEditEav,
  triggered,
  setTriggered,
  formik
) {
  const getData = async (id: string) => {
    try {
      const res = await fetcher({
        url: `/v1/api/guarantee/admin/productTypes/${id}`,
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
          url: `/v1/api/eav/admin/entityTypes/${id}`,
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
      accessorKey: "title",
      header: "نام ",
      Cell: ({ row }) => {
        return (
          <>
            <span className="mr-4">{row?.original?.title}</span>
          </>
        );
      },
    },
    {
      accessorKey: "mandatoryAttendance",
      header: "حضور اجباری",
      Cell: ({ row }) => {
        return (
          <>
            <span className="mr-4">
              {row?.original?.mandatoryAttendance ? "بله" : "خیر"}
            </span>
          </>
        );
      },
    },
    {
      accessorKey: "descriptin",
      header: "توضیحات",
    },
    {
      accessorKey: "Actions",
      header: "عملیات",

      Cell: ({ row }) => (
        <>
          <IconButton
            onClick={async (e) => {
              const editData = await getData(row.original.id);
              console.log(editData);

              setIsEditEav({ active: true, id: row.original.id, open: true });

              formik.setValues({
                ...formik.values,
                title: editData.title,
                mandatoryAttendance: editData.mandatoryAttendance ?? false,
                description: editData.description,
              });
            }}
            aria-label="delete"
            color="primary"
          >
            <ModeEditIcon />
          </IconButton>
        </>
      ),
    },
  ];
}
