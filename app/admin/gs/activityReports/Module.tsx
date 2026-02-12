"use client";

import React, { useEffect, useState } from "react";
import { pageTitle } from "../../layout";
import { useAtom } from "jotai";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Dialog,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  useTheme,
  alpha,
  Tooltip,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import TimelineIcon from "@mui/icons-material/Timeline";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import VisibilityIcon from '@mui/icons-material/Visibility';
import DatePickerPersian from "@/app/components/utils/DatePicker";
import { fetcher } from "@/app/components/admin-components/fetcher";
import toast from "@/app/components/toast";
import PickOrganizationModal from "./Organization";

interface ActivityReportItem {
  count: number;
  requestIds: string[];
  toActivity?: {
    name: string;
  };
  // Add other properties as needed
}

export default function EavTypesModule({ session }: any) {
  const [, setTitle] = useAtom(pageTitle);
  const [triggered, setTriggered] = useState(false);
  const [reportData, setReportData] = useState<ActivityReportItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [organOpen, setOrganOpen] = useState({ isOpen: false, value: null });
  const theme = useTheme();

  // Default filter dates
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

  const [filters, setFilters] = useState({
    startDate: getInitialBeginDate(),
    endDate: getInitialEndDate(),
    organizationId: "",
  });

  useEffect(() => {
    setTitle({
      title: "گزارش فعالیت کاربران",
      buttonTitle: null,
      link: null,
      onClick: null,
    });
  }, []);

  const buildQueryString = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return params.toString();
  };

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const queryString = buildQueryString();
      const response = await fetcher({
        method: "GET",
        url: `/v1/api/guarantee/report/activityReports?${queryString}`,
      });
      setReportData(((response as any)?.result || []) as ActivityReportItem[]);
    } catch (error) {
      console.error("Error fetching report data:", error);
      toast.error("خطا در دریافت داده‌ها");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => setTriggered(!triggered);

  const resetFilters = () => {
    setFilters({
      startDate: getInitialBeginDate(),
      endDate: getInitialEndDate(),
      organizationId: "",
    });
    setOrganOpen({ isOpen: false, value: null });
    setTriggered(!triggered);
  };

  const downloadExcel = async () => {
    if (!filters.startDate || !filters.endDate) {
      toast.error("لطفاً تاریخ‌ها را انتخاب کنید");
      return;
    }

    try {
      const queryString = buildQueryString();
      const response = await fetcher({
        url: `/v1/api/guarantee/report/activityReports/export?${queryString}`,
        method: "GET",
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(
        new Blob([response as BlobPart], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `activity-report_${new Date().toISOString().split("T")[0]}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("فایل با موفقیت دانلود شد");
    } catch (err) {
      toast.error("خطا در دانلود فایل");
      console.error("Download error:", err);
    }
  };

  useEffect(() => {
    if (triggered) fetchReportData();
  }, [triggered]);

  return (
    <div dir="rtl">
      {/* Filter Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        {/* Main Filter Grid */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <DatePickerPersian
              openPast
              label="از تاریخ"
              date={filters.startDate}
              onChange={(value: string | null) => {
                if (!value) return;
                const date = new Date(value);
                date.setHours(0, 0, 0, 0);
                setFilters((prev) => ({
                  ...prev,
                  startDate: date.toISOString(),
                }));
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DatePickerPersian
              label="تا تاریخ"
              openPast
              date={filters.endDate}
              onChange={(value: string | null) => {
                if (!value) return;
                const date = new Date(value);
                date.setHours(23, 59, 59, 999);
                setFilters((prev) => ({
                  ...prev,
                  endDate: date.toISOString(),
                }));
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <p
              className="pb-3"
            >
              انتخاب نماینده
            </p>
            <button
              className="bg-gray-100 block !py-4 px-4 font-bold text-md w-full rounded-xl text-right"
              onClick={(e) =>
                setOrganOpen({
                  ...organOpen,
                  isOpen: true,
                })
              }
            >
              {organOpen.value ?? "نماینده"}
            </button>
            <Dialog
              open={organOpen.isOpen}
              onClose={() => setOrganOpen({ ...organOpen, isOpen: false })}
              fullWidth
              maxWidth="sm"
            >
              <div className="p-4">
                <h2 className="text-lg font-bold mb-4">انتخاب سازمان</h2>
                <PickOrganizationModal
                  setOrganId={setFilters}
                  url={`/v1/api/guarantee/admin/guaranteeOrganizations`}
                  setOrganOpen={setOrganOpen}
                />
              </div>
            </Dialog>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            {/* Empty space for alignment */}
          </Grid>
        </Grid>

        {/* Buttons Row - Full sized with happy colors */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={resetFilters}
            className="flex-1 flex items-center justify-center gap-3 px-6 py-4 h-14 rounded-xl border-2 border-orange-400 text-orange-600 bg-orange-50 font-semibold text-base transition-all duration-300 hover:border-orange-500 hover:bg-orange-100 hover:scale-[1.02]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            حذف فیلترها
          </button>
          <button
            onClick={applyFilters}
            className="flex-1 flex items-center justify-center gap-3 px-6 py-4 h-14 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold text-base transition-all duration-300 hover:from-green-600 hover:to-emerald-700 hover:scale-[1.02]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            اعمال فیلتر
          </button>
          <button
            onClick={downloadExcel}
            className="flex-1 flex items-center justify-center gap-3 px-6 py-4 h-14 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-base transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 hover:scale-[1.02]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            خروجی
          </button>
        </div>
      </Paper>

      {/* Summary Section */}
      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          mb: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          color: "white",
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <TrendingUpIcon sx={{ ml: 1, fontSize: 20 }} />
            <Typography variant="body1" fontWeight="bold">
              گزارش فعالیت کاربران
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            <Box component="span" sx={{ fontWeight: "bold" }}>
              {reportData.length}
            </Box>{" "}
            نوع فعالیت ثبت شده
          </Typography>
        </Box>
      </Paper>

      {/* Report Cards */}
      {loading ? (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            textAlign: "center",
            background: alpha(theme.palette.grey[50], 0.5),
          }}
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
          <Typography variant="body2" color="text.secondary">
            در حال بارگذاری...
          </Typography>
        </Paper>
      ) : reportData.length > 0 ? (
        <Grid container spacing={2}>
          {reportData.map((item, index) => (
            <Grid item xs={12} sm={6} lg={4} key={index}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  background: "#fff",
                  border: `1px solid ${alpha(theme.palette.grey[200], 0.8)}`,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 12px rgba(0,0,0,0.08)",
                    border: `1px solid ${alpha(
                      theme.palette.primary.main,
                      0.2
                    )}`,
                  },
                }}
              >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Box display="flex" alignItems="center">
                      <SwapHorizIcon
                        sx={{
                          ml: 1,
                          color: theme.palette.primary.main,
                          fontSize: 20,
                        }}
                      />
                      <Typography variant="subtitle2" fontWeight="bold">
                        انتقال فعالیت
                      </Typography>
                    </Box>
                    <Box display="flex" gap={1}>
                      <Tooltip title="پیگیری درخواست‌ها">
                        <Button
                          variant="outlined"
                          size="small"
                          color="primary"
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation();
                            const requestIds = item.requestIds?.join(',');
                            window.location.href = `/admin/gs/trackingRequests?requestIds=${requestIds}`;
                          }}
                          sx={{
                            minWidth: 'auto',
                            p: 0.5,
                            '&:hover': {
                              backgroundColor: 'primary.light',
                              color: 'primary.contrastText',
                            },
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </Button>
                      </Tooltip>
                      <Chip
                        label={`${item.count} بار`}
                        size="small"
                        sx={{
                          background: theme.palette.primary.main,
                          color: "white",
                          fontSize: "0.7rem",
                          height: 20,
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Simplified Activity View */}
                  <Box display="flex" alignItems="center">
                    <Box sx={{ flexGrow: 1, textAlign: "center" }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 1.5,
                          background: alpha(theme.palette.primary.main, 0.08),
                          border: `1px solid ${alpha(
                            theme.palette.primary.main,
                            0.2
                          )}`,
                          borderRadius: 1,
                          minHeight: 50,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          variant="caption"
                          fontWeight="600"
                          color="primary.dark"
                          sx={{ fontSize: "0.7rem", lineHeight: 1.2 }}
                        >
                          {item.toActivity?.name ?? "—"}
                        </Typography>
                      </Paper>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 0.5, display: "block", fontSize: "0.6rem" }}
                      >
                        به فعالیت
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            textAlign: "center",
            background: alpha(theme.palette.grey[100], 0.5),
            border: `1px dashed ${alpha(theme.palette.grey[400], 0.5)}`,
          }}
        >
          <TimelineIcon
            sx={{
              fontSize: 40,
              color: "text.secondary",
              mb: 1,
              opacity: 0.5,
            }}
          />
          <Typography variant="body2" color="text.secondary">
            داده‌ای برای نمایش وجود ندارد
          </Typography>
        </Paper>
      )}
    </div>
  );
}
