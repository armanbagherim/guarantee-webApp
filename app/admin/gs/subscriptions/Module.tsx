"use client";

import React, { useEffect, useState } from "react";
import { pageTitle } from "../../layout";
import { useAtom } from "jotai";
import LightDataGrid from "@/app/components/admin-components/LightDataGrid/LightDataGrid";
import { columns } from "./columns";
import DataHandler from "./DataHandler";
import { fetcher, useFetcher } from "@/app/components/admin-components/fetcher";
import { useFormik } from "formik";
import { ConvertToNull } from "@/app/components/utils/ConvertToNull";
import toast from "@/app/components/toast";
import { Button } from "@mui/material";

export default function EavTypesModule() {
  const [title, setTitle] = useAtom(pageTitle);
  const [triggered, setTriggered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isEditEav, setIsEditEav] = useState({
    open: false,
    id: null,
    active: false,
  });

  useEffect(() => {
    setTitle({
      title: "شماره ها",
      buttonTitle: null,
      link: null,
      onClick: null,
    });
  }, []);

  const downloadFile = async () => {
    try {
      // Fetch the file as a blob
      const response = await fetcher({
        url: `/v1/api/guarantee/admin/subscriptions/excel`,
        method: "GET",
        responseType: 'blob', // Important for file downloads
      });

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `numbers.xlsx`);
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <Button onClick={downloadFile} fullWidth variant="contained" color="primary">دریافت خروجی اکسل</Button>
      </div>


      <LightDataGrid
        triggered={triggered}
        url={"/v1/api/guarantee/admin/subscriptions"}
        columns={columns(

        )}
      />
    </div>
  );
}
