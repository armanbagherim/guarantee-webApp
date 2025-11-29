// app/admin/guarantee/report/supplier-reports/columns.tsx

import { Button } from "@mui/material";

export function columns() {
  return [
    {
      accessorKey: "firstname",
      header: "نام",
      Cell: ({ row }: any) => (
        <span className="font-medium">{row.original.firstname || "-"}</span>
      ),
    },
    {
      accessorKey: "lastname",
      header: "نام خانوادگی",
      Cell: ({ row }: any) => (
        <span className="font-medium">{row.original.lastname || "-"}</span>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: "شماره موبایل",
      Cell: ({ row }: any) => (
        <div className="font-mono text-sm" dir="ltr">
          {row.original.phoneNumber || row.original.username || "-"}
        </div>
      ),
    },
    {
      accessorKey: "organization",
      header: "سازمان / نمایندگی",
      Cell: ({ row }: any) => (
        <span className="text-gray-700">
          {row.original.organization || "-"}
        </span>
      ),
    },
    
  ];
}
