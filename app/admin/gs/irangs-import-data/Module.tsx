"use client";

import React, { useEffect, useState, useRef } from "react";
import { pageTitle } from "../../layout";
import { useAtom } from "jotai";
import LightDataGrid from "@/app/components/admin-components/LightDataGrid/LightDataGrid";
import { columns } from "./columns";
import { fetcher } from "@/app/components/admin-components/fetcher";
import toast from "@/app/components/toast";
import { Button } from "@mui/material";
import { FaDownload } from "react-icons/fa";
import Uploader from "@/app/components/admin-components/Uploader";

export default function IrangsImportModule() {
  const [title, setTitle] = useAtom(pageTitle);
  const [triggered, setTriggered] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const isProcessing = useRef(false);

  const downloadSampleExcel = async () => {
    if (isProcessing.current) return;
    isProcessing.current = true;
    setDownloading(true);

    try {
      const response = await fetcher({
        url: "/v1/api/guarantee/admin/irangs-import-data/sample",
        method: "GET",
        responseType: "blob",
      });

      const blob =
        response instanceof Blob
          ? response
          : new Blob([response as BlobPart], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // اسم فایل کاملاً منحصر به فرد (حتی میلی‌ثانیه)
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .slice(0, -5);
      link.setAttribute("download", `sample_irangs_${timestamp}.xlsx`);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("نمونه اکسل دانلود شد");
    } catch (err: any) {
      toast.error(err?.message || "خطا در دانلود فایل");
    } finally {
      setDownloading(false);
      isProcessing.current = false;
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
          color="primary"
          startIcon={<FaDownload />}
          onClick={downloadSampleExcel}
          disabled={downloading}
        >
          {downloading ? "در حال دانلود..." : "دانلود نمونه اکسل"}
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
          refetch={() => setTriggered((prev) => !prev)}
        />
      </div>

      <LightDataGrid
        triggered={triggered}
        url="/v1/api/guarantee/admin/irangs-import-data"
        columns={columns()}
        detailPanel={(row: any) => {
          const orig = row?.original || {};
          const fileName = orig.fileName ?? orig.file_name ?? orig.name ?? "-";
          const createdAt =
            orig.createdAt || orig.created_at || orig.created || null;
          const errorMessage =
            orig.errorMessage || orig.error_message || orig.errorMessage;

          return (
            <div className="p-4">
              <div>
                <strong>نام فایل:</strong> {fileName}
              </div>
              <div>
                <strong>تاریخ آپلود:</strong>{" "}
                {createdAt
                  ? new Date(createdAt).toLocaleDateString("fa-IR")
                  : "-"}
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
