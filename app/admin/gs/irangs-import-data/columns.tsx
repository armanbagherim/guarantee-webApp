import { fetcher } from "@/app/components/admin-components/fetcher";
import React from "react";
import toast from "@/app/components/toast";
import { FaDownload } from "react-icons/fa";

export function columns() {
  const downloadFile = async (id: string, fileName: string) => {
    try {
      const response = await fetcher({
        url: `/v1/api/guarantee/admin/irangs-import-data/${id}/download`,
        method: "GET",
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR');
  };
  return [
    {
      accessorKey: "fileName",
      header: "نام فایل",
    },
    {
      accessorKey: "uploadedBy",
      header: "آپلود کننده",
      Cell: ({ row }: { row: any }) => {
        const user = row?.original?.user;
        if (!user) return "-";
        const name = [user.firstname, user.lastname].filter(Boolean).join(" ");
        return name || user.username || "-";
      },
    },
    {
      accessorKey: "status",
      header: "وضعیت",
      Cell: ({ row }: { row: any }) => {
        const statusObj = row.original.status;
        const statusTitle = typeof statusObj === 'string' ? statusObj : statusObj?.title || statusObj?.name || '';
        const key = (statusTitle || '').toString().toLowerCase();
        const isCompleted = key === 'completed' || row.original.statusId === 3 || key === 'completed';
        const isFailed = key === 'failed' || row.original.statusId === 2 || key === 'failed';

        return (
          <span
            className={
              isCompleted
                ? "text-green-600 bg-green-100 px-2 py-2 rounded-full text-xs font-bold"
                : isFailed
                ? "text-red-600 bg-red-100 px-2 py-2 rounded-full text-xs font-bold"
                : "text-yellow-600 bg-yellow-100 px-2 py-2 rounded-full text-xs font-bold"
            }
          >
            {isCompleted
              ? "تکمیل شده"
              : Processing
              ? "در حال پردازش"
              : "ناموفق"}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "تاریخ آپلود",
      Cell: ({ row }: { row: any }) => formatDate(row.original.createdAt),
    },
    {
      accessorKey: "Actions",
      header: "عملیات",
      Cell: ({ row }: { row: any }) => (
        <div className="flex gap-2">
          <button
            onClick={() => downloadFile(row.original.id, row.original.fileName)}
            className="text-white inline-flex hover:bg-blue-700 transition-all items-center gap-2 justify-between bg-primary py-2 rounded-lg px-3 text-sm"
          >
            <FaDownload />
            <span>دانلود فایل</span>
          </button>
        </div>
      ),
    }
  ];
}
