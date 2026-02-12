"use client";

import React, { useEffect, useState } from "react";
import { pageTitle } from "../../layout";
import { useAtom } from "jotai";
import LightDataGrid from "@/app/components/admin-components/LightDataGrid/LightDataGrid";
import { columns } from "./columns";
import { Button, Grid, Paper, TextField } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import DownloadIcon from "@mui/icons-material/Download";
import DatePickerPersian from "@/app/components/utils/DatePicker";
import { fetcher } from "@/app/components/admin-components/fetcher";
import toast from "@/app/components/toast";

export default function RewardHistoriesModule() {
  const [, setTitle] = useAtom(pageTitle);
  const [triggered, setTriggered] = useState(false);

  const getInitialBeginDate = () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date.toISOString();
  };

  const getInitialEndDate = () => {
    const date = new Date();
    date.setHours(23, 59, 59, 999);
    return date.toISOString();
  };

  const [filters, setFilters] = useState<{
    originalGuaranteeSerialNumber: string;
    userFullName: string;
    startDate: string | null;
    endDate: string | null;
  }>({
    originalGuaranteeSerialNumber: "",
    userFullName: "",
    startDate: getInitialBeginDate(),
    endDate: getInitialEndDate(),
  });

  useEffect(() => {
    setTitle({
      title: "گزارش تاریخچه پاداش",
      buttonTitle: null,
      link: null,
      onClick: null,
    });
  }, [setTitle]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const buildQueryString = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return params.toString();
  };

  const applyFilters = () => setTriggered((prev) => !prev);

  const resetFilters = () => {
    setFilters({
      originalGuaranteeSerialNumber: "",
      userFullName: "",
      startDate: getInitialBeginDate(),
      endDate: getInitialEndDate(),
    });
    setTriggered((prev) => !prev);
  };

  const downloadExcel = async () => {
    if (!filters.startDate || !filters.endDate) {
      toast.error("لطفاً تاریخ‌ها را انتخاب کنید");
      return;
    }

    try {
      const queryString = buildQueryString();
      await fetcher({
        url: `/v1/api/guarantee/report/rewardHistories/export?${queryString}`,
        method: "GET",
        responseType: "blob",
        fileName: `reward-histories_${new Date().toISOString().split("T")[0]}.xlsx`,
      });
      toast.success("فایل با موفقیت دانلود شد");
    } catch (err: any) {
      toast.error(err?.message || "خطا در دانلود فایل");
      console.error("Download error:", err);
    }
  };

  return (
    <div dir="rtl">
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <DatePickerPersian
              openPast
              label="از تاریخ"
              date={filters.startDate}
              onChange={(value: string | null) => {
                if (!value) {
                  setFilters((prev) => ({ ...prev, startDate: null }));
                  return;
                }
                const date = new Date(value);
                date.setHours(0, 0, 0, 0);
                setFilters((prev) => ({ ...prev, startDate: date.toISOString() }));
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <DatePickerPersian
              openPast
              label="تا تاریخ"
              date={filters.endDate}
              onChange={(value: string | null) => {
                if (!value) {
                  setFilters((prev) => ({ ...prev, endDate: null }));
                  return;
                }
                const date = new Date(value);
                date.setHours(23, 59, 59, 999);
                setFilters((prev) => ({ ...prev, endDate: date.toISOString() }));
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="سریال گارانتی"
              name="originalGuaranteeSerialNumber"
              value={filters.originalGuaranteeSerialNumber}
              onChange={handleFilterChange}
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="نام و نام خانوادگی کاربر"
              name="userFullName"
              value={filters.userFullName}
              onChange={handleFilterChange}
              size="small"
            />
          </Grid>

          <Grid item xs={12} container alignItems="center" spacing={1}>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={resetFilters}
              >
                حذف فیلترها
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<FilterListIcon />}
                onClick={applyFilters}
              >
                اعمال فیلتر
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={downloadExcel}
                color="secondary"
              >
                خروجی اکسل
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <LightDataGrid
        triggered={triggered}
        url={`/v1/api/guarantee/report/rewardHistories?${buildQueryString()}`}
        columns={columns()}
        detailPanel={undefined}
      />
    </div>
  );
}
