"use client";
import { fetcher, useFetcher } from "@/app/components/admin-components/fetcher";
import Loading from "@/app/components/admin-components/loading";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { toast } from "react-toastify";
import Image from "next/image";
import { pageTitle } from "@/app/admin/layout";
import LightDataGrid from "@/app/components/admin-components/LightDataGrid/LightDataGrid";
import { Button, IconButton } from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import { useParams } from "next/navigation";

export default function Eav() {
  const params = useParams();
  const [title, setTitle] = useAtom(pageTitle);
  const [triggered, setTriggered] = useState(false);
  useEffect(() => {
    setTitle({
      title: "مقادیر",
      buttonTitle: "افزودن مقدار",
      link: `/admin/eav/entityTypes/fields/${params.id}/values/new/${params.id}`,
    });
  }, []);

  const deleteValue = async (id) => {
    try {
      const result = await Swal.fire({
        title: "مطمئن هستید؟",
        text: "با حذف این گزینه امکان بازگشت آن وجود ندارد",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "بله حذفش کن",
        cancelButtonText: "لغو",
      });

      if (result.isConfirmed) {
        const req = await fetcher({
          url: `/v1/api/eav/admin/attributeValues/${id}`,
          method: "DELETE",
        });
        toast.success("موفق");
        setTriggered(!triggered);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const columns = [
    {
      accessorKey: "value",
      header: "نام ",
      minSize: 100, //min size enforced during resizing
      maxSize: 200, //max size enforced during resizing
      size: 200, //medium column
    },

    {
      accessorKey: "Actions",
      header: "عملیات",
      size: 200,

      Cell: ({ row }) => (
        <>
          <a
            href={`/admin/eav/entityTypes/fields/${params.id}/values/edit/${row.id}`}
          >
            <IconButton aria-label="edit" color="primary">
              <ModeEditIcon />
            </IconButton>
          </a>
          <a onClick={(e) => deleteValue(row.id)}>
            <IconButton aria-label="delete" color="error">
              <DeleteIcon />
            </IconButton>
          </a>
        </>
      ),
    },
  ];

  return (
    <div>
      <LightDataGrid
        url={`/v1/api/eav/admin/attributeValues?sortOrder=ASC&orderBy=id&ignorePaging=false&attributeId=${params.id}`}
        columns={columns}
        triggered={triggered}
      />
    </div>
  );
}
