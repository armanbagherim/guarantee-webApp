"use client";

import { MRT_ColumnDef } from "material-react-table";

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
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch (error) {
    return "—";
  }
};

export function columns(): MRT_ColumnDef<any>[] {
  return [
    {
      accessorKey: "discountCode",
      header: "کد تخفیف",
    },
    {
      accessorKey: "userFullName",
      header: "نام کاربر",
      Cell: ({ row }) => row.original.userFullName ?? "—",
    },
    {
      accessorKey: "phoneNumber",
      header: "شماره موبایل",
      Cell: ({ row }) =>
        row.original.phoneNumber ||
        row.original.userPhoneNumber ||
        row.original.username ||
        "—",
    },
    {
      accessorKey: "orderId",
      header: "شناسه تراکنش/سفارش",
      Cell: ({ row }) =>
        row.original.orderId || row.original.transactionId || "—",
    },
    {
      accessorKey: "discountAmount",
      header: "مبلغ تخفیف",
      Cell: ({ row }) => `${formatNumber(row.original.discountAmount)} تومان`,
    },
    {
      accessorKey: "usedAt",
      header: "تاریخ استفاده",
      Cell: ({ row }) =>
        formatDate(row.original.usedAt ?? row.original.createdAt),
    },
  ];
}
