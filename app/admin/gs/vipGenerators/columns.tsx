import { fetcher } from "@/app/components/admin-components/fetcher";
import React from "react";
import toast from "@/app/components/toast";
import { IconButton } from "@mui/material";
import { FaDownload } from "react-icons/fa";
import Link from "next/link";

export function columns(
  isEditEav,
  setIsEditEav,
  triggered,
  setTriggered,
  formik,
  setContractsModal
) {
  const downloadFile = async (id: string, title: string) => {
    try {
      // Fetch the file as a blob
      const response = await fetcher({
        url: `/v1/api/guarantee/admin/vipGenerators/excel/${id}`,
        method: "GET",
        responseType: 'blob', // Important for file downloads
      });

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title}_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (err) {
      toast.error(err.message);
    }
  };

  // Format price with commas
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR');
  };

  return [
    {
      accessorKey: "title",
      header: "عنوان بسته",
    },
    {
      accessorKey: "vipBundleType.title",
      header: "نوع بسته",
    },
    {
      accessorKey: "price",
      header: "قیمت",
      Cell: ({ row }) => formatPrice(row.original.price),
    },
    {
      accessorKey: "fee",
      header: "کارمزد",
      Cell: ({ row }) => formatPrice(row.original.fee),
    },
    {
      accessorKey: "qty",
      header: "تعداد",
    },
    {
      accessorKey: "isCompleted",
      header: "وضعیت",
      Cell: ({ row }) => (
        <span className={row.original.isCompleted ? "text-green-600" : "text-yellow-600"}>
          {row.original.isCompleted ? "تکمیل شده" : "در حال انجام"}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "تاریخ ایجاد",
      Cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      accessorKey: "Actions",
      header: "عملیات",
      Cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            disabled={!row.original.isCompleted}
            onClick={() => downloadFile(row.original.id, row.original.title)}
            className="text-white disabled:opacity-35 inline-flex hover:bg-blue-700 transition-all items-center gap-2 justify-between bg-primary py-2 rounded-lg px-3 text-sm"
          >
            <FaDownload />
            <span>دانلود فایل</span>
          </button>
        </div>
      ),
    },
  ];
}