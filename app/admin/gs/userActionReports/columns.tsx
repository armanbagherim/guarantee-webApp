import { Tooltip, Chip } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import HistoryIcon from "@mui/icons-material/History";
import AdjustIcon from "@mui/icons-material/Adjust";
import Link from "next/link";

export function columns() {
  return [
    {
      accessorKey: "count",
      header: "تعداد",
      Cell: ({ row }) => <Chip label={Number(row.original?.count || 0).toLocaleString("fa-IR")} size="small" />,
    },
    {
      accessorKey: "fromUser",
      header: "از کاربر",
      Cell: ({ row }) => {
        const u = row.original?.fromUser || {};
        const name = [u.firstname, u.lastname].filter(Boolean).join(" ");
        return name || "-";
      },
    },
    {
      accessorKey: "fromActivity",
      header: "از فعالیت",
      Cell: ({ row }) => row.original?.fromActivity?.name || "-",
    },
    {
      accessorKey: "toActivity",
      header: "به فعالیت",
      Cell: ({ row }) => row.original?.toActivity?.name || "-",
    },
  ];
}
