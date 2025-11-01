"use client";

import React, { useEffect, useState } from "react";
import { pageTitle } from "../../layout";
import { useAtom } from "jotai";
import LightDataGrid from "@/app/components/admin-components/LightDataGrid/LightDataGrid";
import { columns } from "./columns";
import FormGen from "./FormsGen";
import DetailPanel from "./DetailPanel";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Autocomplete,
  Dialog,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import DownloadIcon from "@mui/icons-material/Download";
import DatePickerPersian from "@/app/components/utils/DatePicker";
import { fetcher } from "@/app/components/admin-components/fetcher";
import toast from "@/app/components/toast";
import PickOrganizationModal from "./Organization";

export default function EavTypesModule({ session }) {
  const [title, setTitle] = useAtom(pageTitle);
  const [triggered, setTriggered] = useState(false);
  const [activeRequestActionModal, setActiveRequestActionModal] = useState({
    currentOperation: null,
    isOpen: false,
  });
  const [historyOpen, setHistoryOpen] = useState({
    requestId: null,
    isOpen: false,
  });
  const [attachementsOpen, setAttachementsOpen] = useState({
    requestId: null,
    isOpen: false,
  });

  // Initialize dates with specific times
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
    requestId: "",
    nationalCode: "",
    phoneNumber: "",
    firstname: "",
    lastname: "",
    requestTypeId: "",
    beginDate: getInitialBeginDate(),
    endDate: getInitialEndDate(),
    organizationId: "",
  });

  const [requestTypes, setRequestTypes] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [totals, setTotals] = useState(null);

  useEffect(() => {
    setTitle({
      title: "کارتابل",
      buttonTitle: null,
      link: null,
    });

    const fetchRequestTypes = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/guarantee/client/requestTypes`,
          {
            headers: {
              Authorization: `Bearer ${session.token}`,
            },
          }
        );
        const data = await response.json();
        setRequestTypes(data.result || []);
      } catch (error) {
        console.error("Error fetching request types:", error);
      }
    };

    fetchRequestTypes();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const buildQueryString = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });
    return params.toString();
  };

  const fetchTotals = async () => {
    try {
      const queryString = buildQueryString();
      const res = await fetcher({
        method: "GET",
        url: `/v1/api/guarantee/report/incomeReports/total?${queryString}`,
      });
      setTotals(res.result || null);
    } catch (error) {
      console.error("Error fetching totals:", error);
      setTotals(null);
    }
  };
  const [organOpen, setOrganOpen] = useState({
    isOpen: false,
    value: null,
  });

  const applyFilters = () => {
    setTriggered(!triggered);
    fetchTotals();
  };

  const resetFilters = () => {
    setFilters({
      requestId: "",
      nationalCode: "",
      phoneNumber: "",
      firstname: "",
      lastname: "",
      requestTypeId: "",
      beginDate: getInitialBeginDate(),
      endDate: getInitialEndDate(),
      organizationId: "",
    });
    setOrganOpen({
      isOpen: false,
      value: null,
    });
    setSelectedOrg(null);
    setTriggered(!triggered);
    fetchTotals();
  };

  const downloadExcel = async () => {
    if (!filters.beginDate || !filters.endDate) {
      toast.error("لطفاً تاریخ‌ها را انتخاب کنید");
      return;
    }

    try {
      const queryString = buildQueryString();
      const response = await fetcher({
        url: `/v1/api/guarantee/report/incomeReports/export?${queryString}`,
        method: "GET",
        responseType: "blob",
      });

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `income-report_${new Date().toISOString().split("T")[0]}.xlsx`
      );
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("فایل با موفقیت دانلود شد");
    } catch (err) {
      toast.error("خطا در دانلود فایل");
      console.error("Download error:", err);
    }
  };

  return (
    <div>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <DatePickerPersian
              openPast={true}
              label="از تاریخ"
              date={filters.beginDate}
              onChange={(e) => {
                const date = new Date(e);
                date.setHours(0, 0, 0, 0);
                setFilters((prev) => ({
                  ...prev,
                  beginDate: date.toISOString(),
                }));
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DatePickerPersian
              label="تا تاریخ"
              openPast={true}
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
            <h4 className="mb-4 font-bold">انتخاب نماینده</h4>
            <button
              className="bg-gray-100 p-4 font-bold text-md w-full rounded-xl text-right"
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
              onClose={() =>
                setOrganOpen({
                  ...organOpen,
                  isOpen: false,
                })
              }
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
            spacing={1}
          >
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

      {/* Totals Summary */}
      {totals && (
        <div className="bg-gray-50 p-6 mb-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            خلاصه مبالغ
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-800">
                جمع مبلغ خدمات شامل گارانتی:
              </div>
              <div className="text-base font-bold text-emerald-600">
                {Number(totals.sumOfSolutionIncludeWarranty).toLocaleString()}{" "}
                ءرء
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-800">
                جمع مبلغ خدمات خارج گارانتی:
              </div>
              <div className="text-base font-bold text-amber-600">
                {Number(totals.sumOfSolutionOutOfWarranty).toLocaleString()} ءرء
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-800">
                جمع مبلغ قطعات دارای شرایط گارانتی:
              </div>
              <div className="text-base font-bold text-emerald-500">
                {Number(totals.sumOfPartIncludeWarranty).toLocaleString()} ءرء
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-800">
                جمع مبلغ قطعات خارج شرایط گارانتی:
              </div>
              <div className="text-base font-bold text-orange-500">
                {Number(totals.sumOfPartOutOfWarranty).toLocaleString()} ءرء
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-800">
                حداقل مبلغ دریافت از مشتری برای موارد خارج شرایط گارانتی:
              </div>
              <div className="text-base font-bold text-gray-600">
                {Number(
                  totals.atLeastPayFromCustomerForOutOfWarranty
                ).toLocaleString()}{" "}
                ءرء
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-800">
                پرداخت نقدی دریافت شده از مشتری:
              </div>
              <div className="text-base font-bold text-gray-600">
                {Number(totals.givenCashPayment).toLocaleString()} ءرء
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-800">
                پرداخت نقدی مشتری در صورت نداشتن اعتبار VIP:
              </div>
              <div className="text-base font-bold text-gray-600">
                {Number(
                  totals.extraCashPaymentForUnavailableVip
                ).toLocaleString()}{" "}
                ءرء
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-800">
                پرداخت نماینده به شرکت:
              </div>
              <div className="text-base font-bold text-gray-600">
                {Number(totals.sumOfOrganizationToCompany).toLocaleString()} ءرء
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-800">
                مجموع پرداخت شرکت به نماینده:
              </div>
              <div className="text-base font-bold text-gray-600">
                {Number(totals.sumOfCompanyToOrganization).toLocaleString()} ءرء
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Grid */}
      <LightDataGrid
        triggered={triggered}
        url={`/v1/api/guarantee/report/incomeReports?${buildQueryString()}`}
        columns={columns(
          triggered,
          setTriggered,
          setActiveRequestActionModal,
          historyOpen,
          setHistoryOpen,
          attachementsOpen,
          setAttachementsOpen
        )}
        detailPanel={DetailPanel}
      />
    </div>
  );
}
