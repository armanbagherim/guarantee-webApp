import { Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Uploader from "@/app/components/admin-components/Uploader";
import { fetcher } from "@/app/components/admin-components/fetcher";
import Loading from "@/app/components/admin-components/loading";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
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
        url: `/v1/api/guarantee/admin/variants/${id}`,
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
      accessorKey: "serialNumber",
      header: "شماره گارانتی ",
    },
    {
      accessorKey: "productType.title",
      header: "نوع دستگاه",
    },
    {
      accessorKey: "variant.title",
      header: "مدل دستگاه",
    },
    {
      accessorKey: "guaranteeConfirmStatus.title",
      header: "وضعیت تایید کارت",
      Cell: ({ row }) => {
        return row?.original?.guaranteeConfirmStatus?.id == 2 ? (
          <span className="text-green-600 bg-green-100 px-2 py-2 rounded-full text-xs font-bold my-2 inline">
            {row?.original?.guaranteeConfirmStatus?.title}
          </span>
        ) : (
          <span className="text-red-600 bg-red-100 px-2 py-2 rounded-full text-xs font-bold my-2 inline">
            {row?.original?.guaranteeConfirmStatus?.title}
          </span>
        );
      },
    },
    {
      accessorKey: "guaranteePeriod.title",
      header: "مدت گارانتی",
    },
    {
      accessorKey: "guaranteeType.title",
      header: "نوع گارانتی",
    },
    {
      accessorKey: "brand.title",
      header: "برند",
    },
    {
      accessorKey: "description",
      header: "توضیحات",
    },
    {
      accessorKey: "startDate",
      header: "تاریخ شروع ",
      Cell: ({ row }) => {
        return (
          <>
            <span className="mr-4">
              {new Date(row?.original?.startDate).toLocaleDateString("fa-IR")}
            </span>
          </>
        );
      },
    },
    {
      accessorKey: "endDate",
      header: "تاریخ پایان ",
      Cell: ({ row }) => {
        return (
          <>
            <span className="mr-4">
              {new Date(row?.original?.endDate).toLocaleDateString("fa-IR")}
            </span>
          </>
        );
      },
    },
  ];
}
