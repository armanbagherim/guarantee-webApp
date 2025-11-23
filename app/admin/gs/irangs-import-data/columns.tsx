import { fetcher } from "@/app/components/admin-components/fetcher";
import React from "react";
import toast from "@/app/components/toast";
import { FaDownload } from "react-icons/fa";
import { Tooltip, Typography } from "@mui/material";

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
        const statusId = row.original.statusId;

        // اول وضعیت رو بر اساس statusId تشخیص می‌دیم (قابل اعتمادترین روش)
        let statusKey: string;
        let displayText: string;
        let isCompleted = false;
        let isFailed = false;
        let isProcessing = false;
        let isPending = false;

        switch (statusId) {
          case 1:
            statusKey = "pending";
            displayText = "در انتظار";
            isPending = true;
            break;
          case 2:
            statusKey = "processing";
            displayText = "در حال پردازش";
            isProcessing = true;
            break;
          case 3:
            statusKey = "completed";
            displayText = "تکمیل شده";
            isCompleted = true;
            break;
          case 4:
            statusKey = "failed";
            displayText = "ناموفق";
            isFailed = true;
            break;
          default:
            displayText = "نامشخص";
            statusKey = "unknown";
        }

        // اگر statusId موجود نبود، از روی title یا name امتحان کنیم (فال‌بک)
        if (!statusId && statusObj) {
          const title =
            typeof statusObj === "string"
              ? statusObj
              : statusObj?.title || statusObj?.name || "";
          const lower = title.toLowerCase();

          if (lower.includes("completed") || lower.includes("تکمیل")) {
            displayText = "تکمیل شده";
            isCompleted = true;
          } else if (
            lower.includes("failed") ||
            lower.includes("ناموفق") ||
            lower.includes("خطا")
          ) {
            displayText = "ناموفق";
            isFailed = true;
          } else if (
            lower.includes("processing") ||
            lower.includes("در حال پردازش")
          ) {
            displayText = "در حال پردازش";
            isProcessing = true;
          } else if (lower.includes("pending") || lower.includes("در انتظار")) {
            displayText = "در انتظار";
            isPending = true;
          }
        }

        return (
          <span
            className={`px-3 py-2 rounded-full text-xs font-bold whitespace-nowrap ${
              isCompleted
                ? "text-green-700 bg-green-100"
                : isFailed
                ? "text-red-700 bg-red-100"
                : isProcessing
                ? "text-yellow-700 bg-yellow-100"
                : isPending
                ? "text-blue-700 bg-blue-100"
                : "text-gray-700 bg-gray-100"
            }`}
          >
            {displayText}
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
      accessorKey: "error",
      header: "علت خطا",
      Cell: ({ row }) => {
        const text = row?.original?.error || "";

        return (
          <Tooltip
            title={
              <Typography fontSize={12} sx={{ whiteSpace: "pre-line" }}>
                {text}
              </Typography>
            }
            placement="top"
            arrow
          >
            <Typography
              sx={{
                maxWidth: 180,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                cursor: "default",
              }}
            >
              {text}
            </Typography>
          </Tooltip>
        );
      },
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
    },
  ];
}
