import { Tooltip, Chip } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import HistoryIcon from "@mui/icons-material/History";
import AdjustIcon from "@mui/icons-material/Adjust";
import Link from "next/link";

export function columns() {
  return [
    {
      accessorKey: "givenCashPayment",
      header: "مبلغ نقدی دریافتی",
      Cell: ({ row }) => (
        <Chip
          label={`${Number(row.original?.givenCashPayment || 0).toLocaleString(
            "fa-IR"
          )} ءرء`}
          color="success"
          size="small"
        />
      ),
    },
    {
      accessorKey: "sumOfSolutionIncludeWarranty",
      header: "جمع خدمات شامل گارانتی",
      Cell: ({ row }) => (
        <Chip
          label={`${Number(
            row.original?.sumOfSolutionIncludeWarranty || 0
          ).toLocaleString("fa-IR")} ءرء`}
          color="primary"
          size="small"
        />
      ),
    },
    {
      accessorKey: "sumOfSolutionOutOfWarranty",
      header: "جمع خدمات خارج از گارانتی",
      Cell: ({ row }) => (
        <Chip
          label={`${Number(
            row.original?.sumOfSolutionOutOfWarranty || 0
          ).toLocaleString("fa-IR")} ءرء`}
          color="secondary"
          size="small"
        />
      ),
    },
    {
      accessorKey: "sumOfPartIncludeWarranty",
      header: "جمع قطعات شامل گارانتی",
      Cell: ({ row }) => (
        <Chip
          label={`${Number(
            row.original?.sumOfPartIncludeWarranty || 0
          ).toLocaleString("fa-IR")} ءرء`}
          color="primary"
          size="small"
        />
      ),
    },
    {
      accessorKey: "sumOfPartOutOfWarranty",
      header: "جمع قطعات خارج از گارانتی",
      Cell: ({ row }) => (
        <Chip
          label={`${Number(
            row.original?.sumOfPartOutOfWarranty || 0
          ).toLocaleString("fa-IR")} ءرء`}
          color="secondary"
          size="small"
        />
      ),
    },
    {
      accessorKey: "representiveSharePerson",
      header: "درصد نماینده از خدمات",
      Cell: ({ row }) => (
        <Chip
          label={`${Number(
            row.original?.representiveSharePerson || 0
          ).toLocaleString("fa-IR")} ءرء`}
          color="secondary"
          size="small"
        />
      ),
    },

    {
      accessorKey: "guaranteeRequest.phoneNumber",
      header: "شماره موبایل",
      Cell: ({ row }) => (
        <Tooltip title={row.original?.guaranteeRequest?.phoneNumber || "-"}>
          <Chip
            label={row.original?.guaranteeRequest?.phoneNumber || "-"}
            color="default"
            size="small"
          />
        </Tooltip>
      ),
    },


    {
      accessorKey: "atleastPayFromCustomerForOutOfWarranty",
      header: "حداقل پرداخت از مشتری برای خدمات خارج از گارانتی",
      Cell: ({ row }) => (
        <Chip
          label={`${Number(
            row.original?.atleastPayFromCustomerForOutOfWarranty || 0
          ).toLocaleString("fa-IR")} ءرء`}
          color="info"
          size="small"
        />
      ),
    },
    {
      accessorKey: "extraCachPaymentForUnavailableVip",
      header: "مبلغ نقدی دریافتی بابت خدمات خارج از اعتبار VIP",
      Cell: ({ row }) => (
        <Chip
          label={`${Number(
            row.original?.atleastPayFromCustomerForOutOfWarranty || 0
          ).toLocaleString("fa-IR")} ءرء`}
          color="info"
          size="small"
        />
      ),
    },
    {
      accessorKey: "someOfCompanyToOrganization",
      header: "از شرکت به نمایندگی",
      Cell: ({ row }) => (
        <Chip
          label={`${Number(
            row.original?.companyToOrganization || 0
          ).toLocaleString("fa-IR")} ءرء`}
          color="info"
          size="small"
        />
      ),
    },
    {
      accessorKey: "someOfOrganizationToCompany",
      header: "از نمایندگی به شرکت",
      Cell: ({ row }) => (
        <Chip
          label={`${Number(
            row.original?.organizationToCompany || 0
          ).toLocaleString("fa-IR")} ءرء`}
          color="info"
          size="small"
        />
      ),
    },
    {
      accessorKey: "settlementDate",
      header: "تاریخ تسویه",
      Cell: ({ row }) => {
        const date = row.original?.settlementDate;
        return (
          <Chip
            label={date ? new Date(date).toLocaleDateString("fa-IR") : "-"}
            color="default"
            size="small"
          />
        );
      },
    },

    {
      accessorKey: "Actions",
      header: "عملیات",
      Cell: ({ row }) => {
        return (
          <>
            <div className="p-4">
              <Link
                className="bg-blue-500 text-white p-3 rounded-lg"
                href={`/admin/gs/trackingRequests?requestId=${row.original.requestId}`}
              >
                رهگیری درخواست
              </Link>
            </div>
          </>
        );
      },
    },
  ];
}
