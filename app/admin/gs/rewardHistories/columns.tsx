"use client";

import { Chip } from "@mui/material";

const formatDateTime = (value: unknown) => {
  if (!value) return "—";
  try {
    return new Date(String(value)).toLocaleString("fa-IR");
  } catch {
    return "—";
  }
};

const getSerialNumber = (row: any) => {
  return (
    row?.guarantee?.serialNumber ||
    row?.originalGuaranteeSerialNumber ||
    row?.guarantee?.originalSerialNumber ||
    row?.serialNumber ||
    row?.originalSerial ||
    "—"
  );
};

const getRewardGuaranteeSerial = (row: any) => {
  return (
    row?.rewardGuarantee?.serialNumber ||
    row?.rewardGuaranteeSerial ||
    "—"
  );
};

const getUserFullName = (row: any) => {
  if (row?.userFullName) return row.userFullName;
  if (row?.user?.fullName) return row.user.fullName;
  const firstname = row?.user?.firstname || row?.firstname;
  const lastname = row?.user?.lastname || row?.lastname;
  const fullName = `${firstname ?? ""} ${lastname ?? ""}`.trim();
  return fullName || row?.username || row?.phoneNumber || "—";
};

const getUserContact = (row: any) => {
  return (
    row?.user?.phoneNumber ||
    row?.user?.username ||
    row?.phoneNumber ||
    row?.username ||
    row?.user?.email ||
    "—"
  );
};

const getRewardAmount = (row: any) => {
  return (
    row?.rewardRule?.rewardAmount ??
    row?.rewardAmount ??
    row?.amount ??
    row?.reward ??
    row?.value ??
    null
  );
};

const getUnitTitle = (row: any) => {
  return row?.unitPrice?.title || row?.unitTitle || "";
};

export function columns() {
  return [
    {
      accessorKey: "rewardRule.title",
      header: "عنوان پاداش",
      Cell: ({ row }: any) => row.original?.rewardRule?.title ?? "—",
    },
    {
      accessorKey: "originalGuaranteeSerialNumber",
      header: "سریال گارانتی",
      Cell: ({ row }: any) => (
        <Chip label={String(getSerialNumber(row.original))} size="small" />
      ),
    },
    {
      accessorKey: "userFullName",
      header: "کاربر",
      Cell: ({ row }: any) => (
        <span className="font-medium">{getUserFullName(row.original)}</span>
      ),
    },
    {
      accessorKey: "userContact",
      header: "موبایل/نام کاربری",
      Cell: ({ row }: any) => <span>{getUserContact(row.original)}</span>,
    },
    {
      accessorKey: "rewardAmount",
      header: "مبلغ پاداش",
      Cell: ({ row }: any) => {
        const v = getRewardAmount(row.original);
        if (v === null || v === undefined || v === "") return "—";
        const n = Number(v);
        const unit = getUnitTitle(row.original);
        const formatted = Number.isFinite(n) ? n.toLocaleString("fa-IR") : String(v);
        return unit ? `${formatted} ${unit}` : formatted;
      },
    },
    {
      accessorKey: "rewardGuaranteeSerialNumber",
      header: "سریال ضمانت پاداش",
      Cell: ({ row }: any) => (
        <Chip label={String(getRewardGuaranteeSerial(row.original))} size="small" />
      ),
    },
    {
      accessorKey: "rewardGuarantee.startDate",
      header: "تاریخ شروع پاداش",
      Cell: ({ row }: any) => (
        <span dir="ltr" className="font-mono text-xs">
          {formatDateTime(
            row.original?.rewardGuarantee?.startDate ??
            row.original?.startDate ??
            row.original?.createdAt
          )}
        </span>
      ),
    },
    {
      accessorKey: "rewardGuarantee.endDate",
      header: "تاریخ پایان پاداش",
      Cell: ({ row }: any) => (
        <span dir="ltr" className="font-mono text-xs">
          {formatDateTime(
            row.original?.rewardGuarantee?.endDate ??
            row.original?.endDate ??
            row.original?.expireDate
          )}
        </span>
      ),
    },
  ];
}
