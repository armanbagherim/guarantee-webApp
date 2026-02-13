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
      accessorFn: (row) => row.discountCode?.code ?? "—",
      id: "discountCode",
      header: "کد تخفیف",
    },
    {
      accessorFn: (row) =>
        row.userFullName ??
        (`${row.user?.firstname ?? ""} ${row.user?.lastname ?? ""}`.trim() || "—"),
      id: "userFullName",
      header: "نام کاربر",
    },
    {
      accessorFn: (row) =>
        row.phoneNumber ||
        row.userPhoneNumber ||
        row.username ||
        row.user?.username ||
        "—",
      id: "phoneNumber",
      header: "شماره موبایل",
    },
    {
      accessorFn: (row) => row.orderId || row.transactionId || row.factor?.id || "—",
      id: "orderId",
      header: "شناسه تراکنش/سفارش",
    },
    {
      accessorFn: (row) =>
        formatNumber(
          row.discountAmount ?? row.discountCode?.discountValue ?? row.factor?.totalPrice
        ),
      id: "discountAmount",
      header: "مبلغ تخفیف",
      Cell: ({ cell }) => `${cell.getValue<string>()} تومان`,
    },
    {
      accessorFn: (row) => row.usedAt ?? row.createdAt ?? row.factor?.expireDate ?? null,
      id: "usedAt",
      header: "تاریخ استفاده",
      Cell: ({ cell }) => formatDate(cell.getValue<string>()),
    },
  ];
}
