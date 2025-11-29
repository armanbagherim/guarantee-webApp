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

export default function SupplierReportsModule() {
  const [title, setTitle] = useAtom(pageTitle);
  const [triggered, setTriggered] = useState(false);
  const [loading, setLoading] = useState(false);

  // این ref خیلی مهمه — جلوی دوبار اجرا رو می‌گیره (حتی در Strict Mode)
  const isDownloading = useRef(false);

  const downloadSupplierReportsExcel = async () => {
    // اگر قبلاً در حال دانلود بود یا قبلاً کلیک شده، نادیده بگیر
    if (isDownloading.current) {
      console.log(
        "%c[دانلود اکسل] درخواست تکراری بلاک شد",
        "color: orange; font-weight: bold"
      );
      return;
    }

    isDownloading.current = true;
    setLoading(true);

    try {
      const response = await fetcher({
        url: "/v1/api/guarantee/report/technicalPersonReports/export",
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

      // نام فایل با تاریخ + زمان + میلی‌ثانیه → 100% منحصر به فرد
      const now = new Date();
      const timestamp = now.toISOString().replace(/[:.]/g, "-").slice(0, -5);
      const fileName = `TechnicalPersonReports_${timestamp}.xlsx`;

      link.setAttribute("download", fileName);
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();

      // پاکسازی تمیز
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("گزارش با موفقیت دانلود شد");
    } catch (err: any) {
      console.error("خطا در دانلود گزارش اکسل:", err);
      toast.error(err?.message || "خطا در دانلود فایل اکسل");
    } finally {
      setLoading(false);
      // مهم: ریست کردن فلگ برای دفعات بعدی
      setTimeout(() => {
        isDownloading.current = false;
      }, 1000); // 1 ثانیه تاخیر برای اطمینان از اینکه Strict Mode دوباره فعال نشه
    }
  };

  useEffect(() => {
    setTitle({
      title: "گزارشات افراد فنی",
      buttonTitle: null,
      link: null,
      onClick: null,
    });
  }, [setTitle]);

  return (
    <div>
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

      <LightDataGrid
        triggered={triggered}
        url="/v1/api/guarantee/report/technicalPersonReports"
        columns={columns()} // اگر columns دیگه پارامتر نمی‌خواد، فقط اینطوری صدا بزن
      />
    </div>
  );
}
