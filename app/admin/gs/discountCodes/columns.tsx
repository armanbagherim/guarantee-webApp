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
  DiscountCodeFormValues,
  DiscountCodeRow,
  EditModalState,
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
  formik: FormikProps<DiscountCodeFormValues>
): MRT_ColumnDef<DiscountCodeRow>[] {
  const getData = async (id: string) => {
    try {
      const res: any = await fetcher({
        url: `/v1/api/guarantee/admin/discountCodes/${id}`,
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
          url: `/v1/api/guarantee/admin/discountCodes/${id}`,
          method: "DELETE",
        });
        toast.success("کد تخفیف حذف شد");
        setTriggered(!triggered);
      }
    } catch (error: any) {
      toast.error(error?.message || "خطا در حذف کد");
    }
  };

  const mapResponseToFormik = (data: DiscountCodeRow) => {
    if (!data) return;

    formik.setValues({
      ...formik.values,
      code: data.code ?? "",
      title: data.title ?? "",
      discountTypeId:
        data.discountTypeId ??
        data.discountType?.id ??
        formik.values.discountTypeId ??
        null,
      discountValue: data.discountValue ?? null,
      totalUsageLimit: data.totalUsageLimit ?? null,
      perUserUsageLimit: data.perUserUsageLimit ?? null,
      maxDiscountAmount: +data.maxDiscountAmount ?? null,
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
      accessorKey: "code",
      header: "کد",
    },
    {
      accessorKey: "title",
      header: "عنوان",
    },
    {
      accessorKey: "discountType",
      header: "نوع تخفیف",
      Cell: ({ row }) => row.original.discountType?.title ?? "—",
    },
    {
      accessorKey: "discountValue",
      header: "مقدار تخفیف",
      Cell: ({ row }) => `${formatNumber(row.original.discountValue)}`,
    },
    {
      accessorKey: "maxDiscountAmount",
      header: "سقف تخفیف",
      Cell: ({ row }) => `${formatNumber(row.original.maxDiscountAmount)} تومان`,
    },
    {
      accessorKey: "organizationName",
      header: "نماینده",
      Cell: ({ row }) =>
        row.original.organization?.name ?? row.original.organizationName ?? "—",
    },
    {
      accessorKey: "validUntil",
      header: "مهلت استفاده",
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
          <Tooltip title="ویرایش">
            <IconButton
              size="small"
              color="primary"
              onClick={async () => {
                const data = await getData(row.original.id);
                if (!data) return;

                setIsEditModal({
                  open: true,
                  id: row.original.id,
                  active: true,
                });
                mapResponseToFormik(data);
              }}
            >
              <ModeEditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

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
