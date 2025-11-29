"use client";

import React, { useEffect, useState } from "react";
import { pageTitle } from "../../layout";
import { useAtom } from "jotai";
import LightDataGrid from "@/app/components/admin-components/LightDataGrid/LightDataGrid";
import { columns } from "./columns";
import { fetcher } from "@/app/components/admin-components/fetcher";
import toast from "@/app/components/toast";
import { Button } from "@mui/material";
import { FaDownload } from "react-icons/fa";

export default function SupplierReportsModule() {
  const [title, setTitle] = useAtom(pageTitle);
  const [triggered, setTriggered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isEditEav, setIsEditEav] = useState({
    open: false,
    id: null,
    active: false,
  });

  // تابع دانلود اکسل گزارش تامین‌کنندگان
  const downloadSupplierReportsExcel = async () => {
    try {
      setLoading(true);

      const response = await fetcher({
        url: "/v1/api/guarantee/report/supplierReports/export",
        method: "GET",
        responseType: "blob", // خیلی مهم برای دانلود فایل
      });

      // ساخت Blob از پاسخ
      const blob = new Blob([response as BlobPart], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // ساخت URL موقت و دانلود فایل
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // نام فایل دلخواه (می‌تونی تغییر بدی)
      const fileName = `SupplierReports_${new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "")}.xlsx`;

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      // پاکسازی
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
      window.URL.revokeObjectURL(url);

      toast.success("فایل اکسل با موفقیت دانلود شد");
    } catch (err: any) {
      console.error("خطا در دانلود اکسل:", err);
      toast.error(err?.message || "خطا در دانلود فایل اکسل");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTitle({
      title: "گزارشات تامین کنندگان",
      buttonTitle: null,
      link: null,
      onClick: null,
    });
  }, [setTitle]);

  return (
    <div>
      {/* بخش دکمه دانلود اکسل */}
      <div className="mb-4 flex justify-end">
        <Button
          variant="contained"
          color="success"
          startIcon={<FaDownload />}
          onClick={downloadSupplierReportsExcel}
          disabled={loading}
          sx={{
            fontFamily: "IRANSans, Arial, sans-serif",
          }}
        >
          {loading ? "در حال دانلود..." : "دانلود گزارش به صورت اکسل"}
        </Button>
      </div>

      {/* جدول اصلی */}
      <LightDataGrid
        triggered={triggered}
        url={"/v1/api/guarantee/report/supplierReports"}
        columns={columns(isEditEav, setIsEditEav, triggered, setTriggered)}
      />
    </div>
  );
}
