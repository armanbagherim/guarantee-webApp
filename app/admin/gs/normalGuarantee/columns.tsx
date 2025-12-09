import { MRT_ColumnDef } from "material-react-table";
import { IconButton, Tooltip } from "@mui/material";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import PersonOffIcon from "@mui/icons-material/PersonOff";

type GuaranteeRow = any; // یا تایپ دقیق داده‌هات رو بذار

export const columns = (
  openAssignDialog: (assignData: any) => void
): MRT_ColumnDef<GuaranteeRow>[] => [
  {
    accessorKey: "serialNumber",
    header: "شماره گارانتی",
  },
  {
    accessorKey: "productType.title",
    header: "نوع دستگاه",
  },
  {
    accessorKey: "variant.title",
    header: "مدل دستگاه",
  },
  {
    accessorKey: "guaranteeConfirmStatus.title",
    header: "وضعیت تایید کارت",
    Cell: ({ row }) => {
      const statusId = row.original.guaranteeConfirmStatus?.id;
      const title = row.original.guaranteeConfirmStatus?.title || "";

      return statusId === 2 ? (
        <span className="text-green-600 bg-green-100 px-3 py-1.5 rounded-full text-xs font-bold">
          {title}
        </span>
      ) : (
        <span className="text-red-600 bg-red-100 px-3 py-1.5 rounded-full text-xs font-bold">
          {title}
        </span>
      );
    },
  },
  {
    accessorKey: "guaranteePeriod.title",
    header: "مدت گارانتی",
  },
  {
    accessorKey: "guaranteeType.title",
    header: "نوع گارانتی",
  },
  {
    accessorKey: "brand.title",
    header: "برند",
  },
  {
    accessorKey: "description",
    header: "توضیحات",
  },
  {
    accessorKey: "startDate",
    header: "تاریخ شروع",
    Cell: ({ row }) => (
      <span dir="ltr" className="font-medium">
        {new Date(row.original.startDate).toLocaleDateString("fa-IR")}
      </span>
    ),
  },
  {
    accessorKey: "endDate",
    header: "تاریخ پایان",
    Cell: ({ row }) => (
      <span dir="ltr" className="font-medium">
        {new Date(row.original.endDate).toLocaleDateString("fa-IR")}
      </span>
    ),
  },
  {
    id: "actions",
    header: "عملیات",
    enableColumnFilter: false,
    enableSorting: false,
    size: 100,
    Cell: ({ row }) => {
      const assign = row.original.assignedGuarantee;
      const hasAssign = !!assign;

      return (
        <Tooltip title={hasAssign ? "نمایش مالک گارانتی" : "تخصیص داده نشده"}>
          <IconButton
            size="small"
            color={hasAssign ? "primary" : "default"}
            onClick={() => openAssignDialog(assign)}
          >
            {hasAssign ? <AssignmentIndIcon /> : <PersonOffIcon />}
          </IconButton>
        </Tooltip>
      );
    },
  },
];