import { fetcher } from "@/app/components/admin-components/fetcher";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Swal from "sweetalert2";
import GavelIcon from "@mui/icons-material/Gavel";
import concat from "@/app/components/utils/AddressConcat";

export function columns(
  triggered,
  setTriggered,
  setActiveRequestActionModal,
  istoryOpen,
  setHistoryOpen
) {
  const getData = async (id: string) => {
    try {
      const res = await fetcher({
        url: `/v1/api/guarantee/admin/guaranteeOrganizations/${id}`,
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
      accessorKey: "requestId",
      header: "شماره درخواست",
      size: 10, //small column
      maxSize: 10,
    },
    {
      accessorKey: "activity.name",
      header: "وضعیت",
      size: 40,
      maxSize: 40,
      Cell: ({ row }) => {
        return (
          <Tooltip title={row.original?.activity?.name}>
            <span className="w-[150px] overflow-hidden truncate block">
              {row.original?.activity?.name}
            </span>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: "user",
      header: "کاربر",
      size: 20,
      maxSize: 20,
      Cell: ({ row }) => {
        return (
          <Tooltip
            title={`${row?.original?.guaranteeRequest?.user?.firstname} ${row?.original?.guaranteeRequest?.user?.lastname}`}
          >
            <span className="w-[100px] overflow-hidden truncate block">
              {row?.original?.guaranteeRequest?.user?.firstname}{" "}
              {row?.original?.guaranteeRequest?.user?.lastname}
            </span>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: "phoneNumber",
      header: "شماره موبایل",
      size: 20,
      maxSize: 20,
      enableColumnFilter: true,
      Cell: ({ row }) => {
        return (
          <Tooltip title={`${row?.original?.guaranteeRequest?.phoneNumber}`}>
            <span className="w-[100px] font-bold overflow-hidden truncate block">
              {row?.original?.guaranteeRequest?.phoneNumber}
            </span>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: "product",
      header: "محصول",
      Cell: ({ row }) => {
        return `${row?.original?.guaranteeRequest?.brand?.title} ${row?.original?.guaranteeRequest?.variant?.title} (${row?.original?.guaranteeRequest?.productType?.title})`;
      },
    },
    {
      accessorKey: "requestTypeId",
      header: "نوع درخواست",
      filterVariant: "select",
      filterSelectOptions: [
        { label: "نصب", value: "1" },
        { label: "تعمیر", value: "2" },
      ],
      size: 20,
      maxSize: 20,
      Cell: ({ row }) => {
        return (
          <Tooltip
            title={`${row?.original?.guaranteeRequest?.requestType?.title}`}
          >
            <span className="w-[60px] overflow-hidden truncate block">
              {row?.original?.guaranteeRequest?.requestType?.title}
            </span>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: "guaranteeRequest.requestCategory.title",
      header: "نوع گارانتی",
    },
    {
      accessorKey: "guaranteeRequest.guarantee.serialNumber",
      header: "شماره سریال",
    },

    {
      accessorKey: "Actions",
      header: "عملیات",

      Cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            className="px-3 py-2 text-xs font-bold bg-primary/10 hover:bg-primary/20 transition-all text-primary rounded-lg"
            onClick={async (e) => {
              setActiveRequestActionModal({
                currentOperation: row.original,
                isOpen: true,
              });
            }}
          >
            اقدام
          </button>
          <button
            className="px-3 py-2 text-xs font-bold bg-primary/10 hover:bg-primary/20 transition-all text-primary rounded-lg"
            onClick={async (e) => {
              setHistoryOpen({
                requestId: row.original.requestId,
                isOpen: true,
              });
            }}
          >
            گردش درخواست
          </button>
        </div>
      ),
    },
  ];
}
