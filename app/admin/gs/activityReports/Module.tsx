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
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import TimelineIcon from "@mui/icons-material/Timeline";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DatePickerPersian from "@/app/components/utils/DatePicker";
import { fetcher } from "@/app/components/admin-components/fetcher";
import toast from "@/app/components/toast";
import PickOrganizationModal from "./Organization";

export default function EavTypesModule({ session }) {
  const [title, setTitle] = useAtom(pageTitle);
  const [triggered, setTriggered] = useState(false);
  const [reportData, setReportData] = useState([]);
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
      setReportData(response.result || []);
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

      const url = window.URL.createObjectURL(new Blob([response]));
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
      {/* Filters */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.03
          )} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
        }}
      >
        <Grid container spacing={1.5}>
          <Grid item xs={12} sm={6} md={3}>
            <DatePickerPersian
              openPast
              label="از تاریخ"
              date={filters.startDate}
              onChange={(e) => {
                const date = new Date(e);
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
              onChange={(e) => {
                const date = new Date(e);
                date.setHours(23, 59, 59, 999);
                setFilters((prev) => ({
                  ...prev,
                  endDate: date.toISOString(),
                }));
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="caption"
              sx={{ mb: 0.5, display: "block", fontWeight: 600 }}
            >
              انتخاب نماینده
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              size="small"
              sx={{
                p: 1.5,
                justifyContent: "flex-start",
                borderColor: alpha(theme.palette.primary.main, 0.2),
                fontSize: "0.875rem",
              }}
              onClick={() => setOrganOpen({ ...organOpen, isOpen: true })}
            >
              {organOpen.value || "نماینده"}
            </Button>
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

          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            container
            alignItems="center"
            spacing={0.5}
          >
            <Grid item>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ClearIcon />}
                onClick={resetFilters}
                sx={{ fontSize: "0.75rem" }}
              >
                حذف فیلترها
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                size="small"
                startIcon={<FilterListIcon />}
                onClick={applyFilters}
                sx={{ fontSize: "0.75rem" }}
              >
                اعمال فیلتر
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                size="small"
                startIcon={<DownloadIcon />}
                onClick={downloadExcel}
                color="success"
                sx={{ fontSize: "0.75rem" }}
              >
                خروجی
              </Button>
            </Grid>
          </Grid>
        </Grid>
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
