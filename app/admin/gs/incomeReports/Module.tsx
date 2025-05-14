"use client";

import React, { useEffect, useState } from "react";
import { pageTitle } from "../../layout";
import { useAtom } from "jotai";
import LightDataGrid from "@/app/components/admin-components/LightDataGrid/LightDataGrid";
import { columns } from "./columns";
import FormGen from "./FormsGen";
import DetailPanel from "./DetailPanel";
import { TextField, Button, Grid, Paper, Autocomplete } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import DatePickerPersian from "@/app/components/utils/DatePicker";
import { fetcher } from "@/app/components/admin-components/fetcher";

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

    const fetchOrganizations = async () => {
      try {
        const res = await fetcher({
          method: "GET",
          url: `/v1/api/guarantee/admin/guaranteeOrganizations`,
        });
        setOrganizations(res.result || []);
      } catch (error) {
        console.error("Error fetching initial organizations:", error);
      }
    };

    fetchRequestTypes();
    fetchOrganizations();
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
    setSelectedOrg(null);
    setTriggered(!triggered);
    fetchTotals();
  };

  return (
    <div>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <DatePickerPersian
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
            <label className="mt-4 font-bold text-sm mb-4 block" htmlFor="">
              انتخاب نماینده
            </label>
            <Autocomplete
              options={organizations}
              getOptionLabel={(option) =>
                `${option.user.firstname} ${option.user.lastname}` || ""
              }
              value={selectedOrg}
              onChange={(event, newValue) => {
                setSelectedOrg(newValue);
                setFilters((prev) => ({
                  ...prev,
                  organizationId: newValue?.id || "",
                }));
              }}
              renderInput={(params) => (
                <TextField {...params} label="نماینده" size="small" />
              )}
            />
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
          </Grid>
        </Grid>
      </Paper>

      {/* Totals Summary */}
      {totals && (
        <div className="bg-gray-50 p-6 mb-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">خلاصه مبالغ</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-800">
                جمع مبلغ خدمات شامل گارانتی:
              </div>
              <div className="text-base font-bold text-emerald-600">
                {Number(totals.sumOfSolutionIncludeWarranty).toLocaleString()} ءرء
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
                {Number(totals.atLeastPayFromCustomerForOutOfWarranty).toLocaleString()}{" "}
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
                {Number(totals.extraCashPaymentForUnavailableVip).toLocaleString()} ءرء
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