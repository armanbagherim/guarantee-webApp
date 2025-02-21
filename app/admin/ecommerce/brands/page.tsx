"use client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import {
  fetcher,
  useFetcher,
} from "../../../components/admin-components/fetcher";
import Loading from "../../../components/admin-components/loading";
import { useAtom } from "jotai";
import { pageTitle } from "../../layout";
import { toast } from "react-toastify";
import Image from "next/image";
import Uploader from "@/app/components/admin-components/Uploader";
import LightDataGrid from "@/app/components/admin-components/LightDataGrid/LightDataGrid";
import { Button, IconButton } from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";

export default function Brands() {
  const [title, setTitle] = useAtom(pageTitle);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    setTitle({
      title: "برند ها",
      buttonTitle: "افزودن برند",
      link: "/admin/ecommerce/brands/new",
    });
  }, []);

  const deleteBrand = async (id) => {
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
          url: `/v1/api/ecommerce/brands/${id}`,
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
      maxSize: 400, //max size enforced during resizing
      size: 180, //medium column
    },
    {
      accessorKey: "slug",
      header: "لینک ",
      minSize: 100, //min size enforced during resizing
      maxSize: 400, //max size enforced during resizing
      size: 180, //medium column
    },
    {
      accessorKey: "image",
      header: "تصویر ",
      size: 20,
      Cell({ row }) {
        return row.original.attachment ? (
          <Image
            loading="eager"
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/brands/${
              row.original.attachment?.fileName || ""
            }`}
            width={50}
            height={50}
            alt=""
          />
        ) : (
          <img width={30} height={30} src="/images/no-photos.png" alt="" />
        );
      },
    },
    {
      accessorKey: "Actions",
      header: "عملیات",
      size: 200,

      Cell: ({ row }) => (
        <>
          <a href="#">
            <Uploader location={`v1/api/ecommerce/brands/image`} id={row.id} />
          </a>
          <a href={`/admin/ecommerce/brands/${row.id}`}>
            <IconButton aria-label="delete" color="primary">
              <ModeEditIcon />
            </IconButton>
          </a>
          <a onClick={(e) => deleteBrand(row.id)}>
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
        url={
          "/v1/api/ecommerce/brands?sortOrder=ASC&offset=0&limit=10&orderBy=id&ignorePaging=false"
        }
        triggered={triggered}
        columns={columns}
      />
    </div>
  );
}
