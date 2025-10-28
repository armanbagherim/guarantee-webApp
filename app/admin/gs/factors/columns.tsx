import Link from "next/link";
import React from "react";
import { FaPrint } from "react-icons/fa";

export function columns() {
  const formatPrice = (price: string) =>
    new Intl.NumberFormat("fa-IR").format(Number(price)) + " ءرء";

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("fa-IR");

  const getStatusText = (statusId: number) => {
    const statusMap: Record<number, string> = {
      1: "در انتظار پرداخت",
      2: "در حال پردازش",
      3: "پرداخت شده",
      4: "لغو شده",
    };
    return statusMap[statusId] || "نامشخص";
  };

  return [
    {
      accessorKey: "fullName",
      header: "نام مشتری",
      Cell: ({ row }) => <span>{row.original.fullName}</span>,
    },
    {
      accessorKey: "createdAt",
      header: "تاریخ ایجاد",
      Cell: ({ row }) => <span>{formatDate(row.original.createdAt)}</span>,
    },
    {
      accessorKey: "settlementDate",
      header: "تاریخ پرداخت",
      Cell: ({ row }) => <span>{formatDate(row.original.settlementDate)}</span>,
    },
    {
      accessorKey: "totalPrice",
      header: "مبلغ کل",
      Cell: ({ row }) => (
        <span>{formatPrice(row.original.totalPrice)}</span>
      ),
    },
    {
      accessorKey: "factorStatusId",
      header: "وضعیت",
      Cell: ({ row }) => (
        <span>{getStatusText(row.original.factorStatusId)}</span>
      ),
    },
    {
      accessorKey: "actions",
      header: "عملیات",
      Cell: ({ row }) => (
        <div className="p-2">
          <Link

            href={`/factorDetail/admin/${row.original.id}`}
            target="_blank"
            className="text-white inline-flex hover:bg-blue-700 transition-all items-center gap-2 justify-between bg-primary py-3 rounded-xl px-4 font-sm m-2"
          >
            <FaPrint />
            <span>پرینت</span>

          </Link>
        </div>
      ),
    },
  ];
}
