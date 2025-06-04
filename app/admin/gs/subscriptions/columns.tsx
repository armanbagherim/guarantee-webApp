import { Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Uploader from "@/app/components/admin-components/Uploader";
import { fetcher } from "@/app/components/admin-components/fetcher";
import Loading from "@/app/components/admin-components/loading";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import toast from "@/app/components/toast";
import Image from "next/image";
import { Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Swal from "sweetalert2";
import SubjectIcon from "@mui/icons-material/Subject";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

export function columns(
  isEditEav,
  setIsEditEav,
  triggered,
  setTriggered,
  formik
) {
  const getData = async (id: string) => {
    try {
      const res = await fetcher({
        url: `/v1/api/guarantee/admin/variants/${id}`,
        method: "GET",
      });
      return res.result;
    } catch (err) {
      toast.error(err.message);
    }
  };

  return [
    {
      accessorKey: "phoneNumber",
      header: "شماره موبایل ",
    },

  ];
}
