"use client";

import { fetcher } from "@/app/components/admin-components/fetcher";
import toast from "@/app/components/toast";
import { IconButton, Tooltip, Chip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Swal from "sweetalert2";
import { MRT_ColumnDef } from "material-react-table";
import { Dispatch, SetStateAction } from "react";
import { FormikProps } from "formik";
import {
  EditModalState,
  RewardRuleFormValues,
  RewardRuleRow,
} from "./types";

const formatNumber = (value?: number | null) => {
  if (value === null || value === undefined) return "—";
  return Number(value).toLocaleString("fa-IR");
};

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(value));
  } catch (error) {
    return "—";
  }
};

export function columns(
  isEditModal: EditModalState,
  setIsEditModal: Dispatch<SetStateAction<EditModalState>>,
  triggered: boolean,
  setTriggered: Dispatch<SetStateAction<boolean>>,
  formik: FormikProps<RewardRuleFormValues>
): MRT_ColumnDef<RewardRuleRow>[] {
  const getData = async (id: string) => {
    try {
      const res: any = await fetcher({
        url: `/v1/api/guarantee/admin/rewardRules/${id}`,
        method: "GET",
      });
      return res.result;
    } catch (error: any) {
      toast.error(error?.message || "خطا در دریافت اطلاعات");
      return null;
    }
  };

  const deleteItem = async (id: string) => {
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
        await fetcher({
          url: `/v1/api/guarantee/admin/rewardRules/${id}`,
          method: "DELETE",
        });
        toast.success("قانون پاداش حذف شد");
        setTriggered(!triggered);
      }
    } catch (error: any) {
      toast.error(error?.message || "خطا در حذف قانون");
    }
  };

  const mapResponseToFormik = (data: RewardRuleRow) => {
    if (!data) return;

    formik.setValues({
      ...formik.values,
      title: data.title ?? "",
      rewardAmount: data.rewardAmount ?? null,
      monthPeriod: data.monthPeriod ?? null,
      validFrom: data.validFrom ?? null,
      validUntil: data.validUntil ?? null,
      isActive:
        typeof data.isActive === "boolean"
          ? data.isActive
          : formik.values.isActive,
      description: data.description ?? "",
    });
  };

  return [
    {
      accessorKey: "title",
      header: "عنوان",
    },
    {
      accessorKey: "rewardAmount",
      header: "مبلغ پاداش",
      Cell: ({ row }) => `${formatNumber(row.original.rewardAmount)} تومان`,
    },

    {
      accessorKey: "monthPeriod",
      header: "بازه ماهانه",
      Cell: ({ row }) => formatNumber(row.original.monthPeriod),
    },
    {
      accessorKey: "validFrom",
      header: "تاریخ شروع",
      Cell: ({ row }) => formatDate(row.original.validFrom),
    },
    {
      accessorKey: "validUntil",
      header: "تاریخ پایان",
      Cell: ({ row }) => formatDate(row.original.validUntil),
    },
    {
      accessorKey: "isActive",
      header: "وضعیت",
      Cell: ({ row }) => (
        <Chip
          label={row.original.isActive ? "فعال" : "غیرفعال"}
          color={row.original.isActive ? "success" : "default"}
          size="small"
        />
      ),
    },
    {
      accessorKey: "Actions",
      header: "عملیات",
      size: 20,
      maxSize: 20,
      Cell: ({ row }) => (
        <div className="flex items-center gap-1">


          <Tooltip title="حذف">
            <IconButton
              size="small"
              color="error"
              onClick={() => deleteItem(row.original.id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];
}
