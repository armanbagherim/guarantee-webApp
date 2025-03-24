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
      accessorKey: "activity.name",
      header: "وضعیت",
    },
    {
      accessorKey: "user",
      header: "کاربر",
      Cell: ({ row }) => {
        return `${row?.original?.guaranteeRequest?.user?.firstname} ${row?.original?.guaranteeRequest?.user?.lastname}`;
      },
    },
    {
      accessorKey: "guaranteeRequest.phoneNumber",
      header: "شماره موبایل",
    },
    {
      accessorKey: "product",
      header: "محصول",
      Cell: ({ row }) => {
        return `${row?.original?.guaranteeRequest?.brand?.title} ${row?.original?.guaranteeRequest?.variant?.title} (${row?.original?.guaranteeRequest?.productType?.title})`;
      },
    },
    {
      accessorKey: "guaranteeRequest.requestType.title",
      header: "نوع درخواست",
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
      accessorKey: "address",
      header: "آدرس",
      Cell: ({ row }) => {
        const address = row?.original?.guaranteeRequest?.address;
        const fullAddress = `${concat(address)}`;
        const limitedAddress = fullAddress.split(" ").slice(0, 4).join(" ") + "..."; // Limit to 4 words

        return (
          <Tooltip title={fullAddress} placement="top" arrow>
            <span>{limitedAddress}</span>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: "Actions",
      header: "عملیات",

      Cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            onClick={async (e) => {
              setActiveRequestActionModal({
                currentOperation: row.original,
                isOpen: true
              })
            }}
            variant="outlined"
            color="primary"
          >
            اقدام
          </Button>
          <Button
            onClick={async (e) => {
              setHistoryOpen({
                requestId: row.original.requestId,
                isOpen: true
              })
            }}
            variant="outlined"
            color="primary"
          >
            گردش درخواست
          </Button>
        </div>
      ),
    },
  ];
}
