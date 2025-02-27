"use client";
import { useFetcher } from "@/app/components/admin-components/fetcher";
import Loading from "@/app/components/admin-components/loading";
import { DataGrid, GridColDef, GridRowsProp, faIR } from "@mui/x-data-grid";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { pageTitle } from "../../layout";
import LightDataGrid from "@/app/components/admin-components/LightDataGrid/LightDataGrid";
import { Button, IconButton } from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import ChangeFormatDate from "@/app/components/admin-components/ChangeFormatDate";

export default function Users() {
  const [title, setTitle] = useAtom(pageTitle);

  useEffect(() => {
    setTitle({
      title: "کاربران",
      buttonTitle: "",
      link: "",
    });
  }, []);

  const columns = [
    {
      accessorKey: "firstname",
      header: "نام ",
      minSize: 100,
      maxSize: 100,
      size: 100,
    },
    {
      accessorKey: "lastname",
      header: "نام خانوادگی",
      minSize: 100,
      maxSize: 400,
      size: 180,
    },
    {
      accessorKey: "phoneNumber",
      header: "شماره موبایل",
      minSize: 100,
      maxSize: 400,
      size: 180,
    },
    {
      accessorKey: "createdAt",
      header: "تاریخ ایجاد کاربر",
      minSize: 100,
      maxSize: 400,
      size: 180,
      Cell({ row }) {
        return ChangeFormatDate(row.original.updatedAt);
      },
    },
    {
      accessorKey: "Actions",
      header: "عملیات",
      size: 200,

      Cell: ({ row }) => (
        <>
          <a href={`/admin/core/users/${row.id}`}>
            <IconButton aria-label="delete" color="primary">
              <ModeEditIcon />
            </IconButton>
          </a>
        </>
      ),
    },
  ];

  return <LightDataGrid url={"/v1/api/core/admin/users"} columns={columns} />;
}
