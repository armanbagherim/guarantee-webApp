"use client";
import { fetcher, useFetcher } from "@/app/components/admin-components/fetcher";
import Loading from "@/app/components/admin-components/loading";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { pageTitle } from "@/app/admin/layout";
import LightDataGrid from "@/app/components/admin-components/LightDataGrid/LightDataGrid";
import { Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useParams } from "next/navigation";

export default function Eav() {
  const params = useParams();
  const [title, setTitle] = useAtom(pageTitle);
  const [triggered, setTriggered] = useState(false);

  const { data: eav, isLoading: eavIsLoading } = useFetcher(
    `/v1/api/eav/admin/entityTypes/${params.id}`,
    "GET"
  );

  useEffect(() => {
    if (!eavIsLoading) {
      setTitle({
        title: `فاکتور های دسته ${eav.result.name ?? ""}`,
        buttonTitle: "افزودن فاکتور",
        link: `/admin/eav/entityTypes/factors/${params.id}/new`,
      });
    }
  }, [eavIsLoading]);

  const deleteItem = async (id) => {
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
          url: `/v1/api/ecommerce/admin/entityTypeFactors/${id}`,
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
      accessorKey: "name",
      header: "نام ",
      minSize: 100, //min size enforced during resizing
      maxSize: 200, //max size enforced during resizing
      size: 200, //medium column
    },
    {
      accessorKey: "priority",
      header: "اولویت",
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
          {row?.original?.attributeType?.valueBased == true ? (
            <a href={`/admin/eav/entityTypes/fields/${row.id}/values`}>
              <Button type="button" variant="outlined">
                مقادیر
              </Button>
            </a>
          ) : (
            ""
          )}
          <a onClick={(e) => deleteItem(row.id)}>
            <IconButton aria-label="delete" color="error">
              <DeleteIcon />
            </IconButton>
          </a>
          <a
            href={`/admin/eav/entityTypes/factors/${params.id}/edit/${row.id}`}
          >
            <IconButton aria-label="delete" color="primary">
              <ModeEditIcon />
            </IconButton>
          </a>
        </>
      ),
    },
  ];

  return (
    <div>
      <LightDataGrid
        url={`/v1/api/ecommerce/admin/entityTypeFactors?entityTypeId=${+params.id}`}
        columns={columns}
        triggered={triggered}
      />
    </div>
  );
}
