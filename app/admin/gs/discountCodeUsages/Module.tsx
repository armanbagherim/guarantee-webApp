"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAtom } from "jotai";
import { pageTitle } from "../../layout";
import LightDataGrid from "@/app/components/admin-components/LightDataGrid/LightDataGrid";
import { columns } from "./columns";
import {
  Box,
  Button,
  Grid,
  Stack,
  TextField,
  InputAdornment,
  Badge,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import DateRangeIcon from "@mui/icons-material/DateRange";
import PersonIcon from "@mui/icons-material/Person";
import NumbersIcon from "@mui/icons-material/Numbers";
import DatePickerPersian from "@/app/components/utils/DatePicker";
import { fetcher } from "@/app/components/admin-components/fetcher";
import toast from "@/app/components/toast";
import { FaDownload } from "react-icons/fa";

export default function DiscountCodeUsagesModule() {
  const [, setTitle] = useAtom(pageTitle);
  const baseUrl = "/v1/api/guarantee/report/discountCodeUsages";
  const exportUrl = "/v1/api/guarantee/report/discountCodeUsages/export";

  const [triggered, setTriggered] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [loading, setLoading] = useState(false);
  type FilterState = {
    discountCode: string;
    userFullName: string;
    startDate: Date | null;
    endDate: Date | null;
  };

  const [filters, setFilters] = useState<FilterState>({
    discountCode: "",
    userFullName: "",
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    setTitle({
      title: "گزارش مصرف کد تخفیف",
      buttonTitle: null,
      link: null,
      onClick: null,
    });
  }, [setTitle]);

  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "discountCode" || name === "userFullName") {
      setFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }, []);

  const handleStartDateChange = useCallback((isoDate: string | null) => {
    if (!isoDate) {
      setFilters((prev) => ({ ...prev, startDate: null }));
      return;
    }
    const date = new Date(isoDate);
    date.setHours(0, 0, 0, 0);
    setFilters((prev) => ({ ...prev, startDate: date }));
  }, []);

  const handleEndDateChange = useCallback((isoDate: string | null) => {
    if (!isoDate) {
      setFilters((prev) => ({ ...prev, endDate: null }));
      return;
    }
    const date = new Date(isoDate);
    date.setHours(23, 59, 59, 999);
    setFilters((prev) => ({ ...prev, endDate: date }));
  }, []);

  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (!value) return;
      if (value instanceof Date) {
        params.append(key, value.toISOString());
      } else if (String(value).trim() !== "") {
        params.append(key, String(value).trim());
      }
    });
    return params.toString();
  }, [filters]);

  const applyFilters = useCallback(() => {
    const queryString = buildQueryString();
    const newUrl = `${baseUrl}${queryString ? "?" + queryString : ""}`;
    setCurrentUrl(newUrl);
    setTriggered((prev) => !prev);
  }, [baseUrl, buildQueryString]);

  const resetFilters = useCallback(() => {
    setFilters({
      discountCode: "",
      userFullName: "",
      startDate: null,
      endDate: null,
    });
    setCurrentUrl("");
    setTriggered(false);
  }, [baseUrl]);

  const activeFiltersCount = useMemo(
    () =>
      Object.values(filters).filter((value) => value && String(value).trim() !== "").length,
    [filters]
  );

  const downloadExcel = useCallback(async () => {
    try {
      setLoading(true);
      const queryString = buildQueryString();
      const urlWithParams = `${exportUrl}${queryString ? "?" + queryString : ""}`;
      const response = await fetcher({
        url: urlWithParams,
        method: "GET",
        responseType: "blob",
      });

      const blob = new Blob([response as BlobPart], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const fileName = `DiscountCodeUsages_${new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "")}.xlsx`;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
      window.URL.revokeObjectURL(url);
      toast.success("فایل اکسل با موفقیت دانلود شد");
    } catch (err: any) {
      toast.error(err?.message || "خطا در دانلود فایل اکسل");
    } finally {
      setLoading(false);
    }
  }, [buildQueryString, exportUrl]);

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        {activeFiltersCount > 0 && (
          <Badge color="primary" badgeContent={activeFiltersCount} />
        )}
        <Button
          variant="contained"
          color="success"
          startIcon={<FaDownload />}
          onClick={downloadExcel}
          disabled={loading}
        >
          {loading ? "در حال دانلود..." : "دانلود اکسل"}
        </Button>
      </Box>

      <Box
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          border: "1px solid #e5e7eb",
          background: "#fff",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="کد تخفیف"
              name="discountCode"
              value={filters.discountCode}
              onChange={handleFilterChange}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <NumbersIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="نام کاربر"
              name="userFullName"
              value={filters.userFullName}
              onChange={handleFilterChange}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DatePickerPersian
              openPast
              label="از تاریخ"
              date={filters.startDate}
              onChange={handleStartDateChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DatePickerPersian
              openPast
              label="تا تاریخ"
              date={filters.endDate}
              onChange={handleEndDateChange}
            />
          </Grid>
        </Grid>

        <div className="flex gap-4 mt-6">
          <button
            onClick={resetFilters}
            className="flex-1 flex items-center justify-center gap-3 px-6 py-4 h-14 rounded-xl border-2 border-orange-400 text-orange-600 bg-orange-50 font-semibold text-base transition-all duration-300 hover:border-orange-500 hover:bg-orange-100 hover:scale-[1.02]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            پاکسازی
          </button>
          <button
            onClick={applyFilters}
            className="flex-1 flex items-center justify-center gap-3 px-6 py-4 h-14 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold text-base transition-all duration-300 hover:from-green-600 hover:to-emerald-700 hover:scale-[1.02]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            دریافت گزارش
          </button>
          <button
            onClick={downloadExcel}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-3 px-6 py-4 h-14 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-base transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {loading ? "در حال دانلود..." : "خروجی"}
          </button>
        </div>
      </Box>

      {currentUrl && (
        <LightDataGrid
          triggered={triggered}
          url={currentUrl}
          columns={columns()}
          detailPanel={undefined}
        />
      )}
    </Box>
  );
}
