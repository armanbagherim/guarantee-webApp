"use client";

import React, { useEffect, useState } from "react";
import { pageTitle } from "../../layout";
import { useAtom } from "jotai";
import LightDataGrid from "@/app/components/admin-components/LightDataGrid/LightDataGrid";
import { columns } from "./columns";
import { fetcher } from "@/app/components/admin-components/fetcher";
import toast from "@/app/components/toast";
import { Button } from '@mui/material';
import { FaDownload } from 'react-icons/fa';
import Uploader from "@/app/components/admin-components/Uploader";

export default function IrangsImportModule() {
  const [title, setTitle] = useAtom(pageTitle);
  const [triggered, setTriggered] = useState(false);
  const downloadSampleExcel = async () => {
    try {
      const response = await fetcher({
        url: '/v1/api/guarantee/admin/irangs-import-data/sample',
        method: 'GET',
        responseType: 'blob',
      });

      const blob = new Blob([response as BlobPart]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sample_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    setTitle({
      title: "آپلود اطلاعات ایران جی اس",
      buttonTitle: null,
      link: null,
      onClick: null,
    });
  }, [setTitle]);

  return (
    <div>
      <div className="mb-4 flex justify-end gap-2">
        <Button
          variant="outlined"
          startIcon={<FaDownload />}
          onClick={downloadSampleExcel}
        >
          دانلود نمونه اکسل
        </Button>
        <Uploader
          id=""
          location="v1/api/guarantee/admin/irangs-import-data/upload"
          type="excel"

          text="آپلود فایل جدید"
          photos={[]}
          setPhotos={() => {}}
          triggered={triggered}
          setTriggered={setTriggered}
          isFull={false}
          refetch={() => setTriggered(prev => !prev)}
        />
      </div>

      <LightDataGrid
        triggered={triggered}
        url="/v1/api/guarantee/admin/irangs-import-data"
        columns={columns()}
        detailPanel={(row: any) => {
          const orig = row?.original || {};
          const fileName = orig.fileName ?? orig.file_name ?? orig.name ?? '-';
          const createdAt = orig.createdAt || orig.created_at || orig.created || null;
          const errorMessage = orig.errorMessage || orig.error_message || orig.errorMessage;

          return (
            <div className="p-4">
              <div>
                <strong>نام فایل:</strong> {fileName}
              </div>
              <div>
                <strong>تاریخ آپلود:</strong>{' '}
                {createdAt ? new Date(createdAt).toLocaleDateString('fa-IR') : '-'}
              </div>
              {errorMessage && (
                <div className="text-red-600 mt-2">
                  <strong>پیغام خطا:</strong> {errorMessage}
                </div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
