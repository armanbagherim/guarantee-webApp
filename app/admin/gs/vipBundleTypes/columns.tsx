import { fetcher } from "@/app/components/admin-components/fetcher";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Swal from "sweetalert2";
import GavelIcon from "@mui/icons-material/Gavel";

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
        url: `/v1/api/guarantee/admin/vipBundleTypes/${id}`,
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
      header: "نوع کارت گارانتی وی آی پی",
    },


    {
      accessorKey: "monthPeriod",
      header: "بازه ماهانه",
    },
    {
      accessorKey: "fee",
      header: "مقدار اعتبار",
      Cell: ({ row }) => (
        <span>
          {Number(row?.original?.fee).toLocaleString("fa-IR")}{" "}
          تومان
        </span>
      ),
    },
    {
      accessorKey: "price",
      header: "قیمت",
      Cell: ({ row }) => (
        <span>
          {row?.original?.price
            ? Number(row?.original?.price).toLocaleString("fa-IR")
            : 0}{" "}
          تومان
        </span>
      ),
    },

    {
      accessorKey: "cardColor",
      header: "رنگ کارت",
      Cell: ({ row }) => (
        <span className="w-8 h-8 block rounded-full border-2 border-gray-300" style={{ background: `#${row?.original?.cardColor}` }}></span>
      ),
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
                title: editData.title,
                price: +editData.price,
                fee: +editData.fee,
                cardColor: editData.cardColor,
                monthPeriod: +editData.monthPeriod,
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
