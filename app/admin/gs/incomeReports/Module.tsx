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

  const [filters, setFilters] = useState({
    requestId: "",
    nationalCode: "",
    phoneNumber: "",
    firstname: "",
    lastname: "",
    requestTypeId: "",
    beginDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    organizationId: "",
  });

  const [requestTypes, setRequestTypes] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);

  const [totals, setTotals] = useState(null); // مجموع جدید

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
      beginDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
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
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  beginDate: new Date(e).toISOString(),
                }))
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DatePickerPersian
              label="تا تاریخ"
              date={filters.endDate}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  endDate: new Date(e).toISOString(),
                }))
              }
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
        <Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: "#f9fafb" }}>
          <h3 style={{ marginBottom: "1rem", color: "#374151" }}>
            خلاصه مبالغ
          </h3>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <strong>سهم نماینده (%):</strong>{" "}
              {totals.representativeSharePercent}
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <strong>اجرت داخل گارانتی:</strong>{" "}
              <span style={{ color: "#059669", fontWeight: "bold" }}>
                {Number(totals.sumOfSolutionIncludeWarranty).toLocaleString()}{" "}
                ءرء
              </span>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <strong>اجرت خارج از گارانتی:</strong>{" "}
              <span style={{ color: "#f59e0b", fontWeight: "bold" }}>
                {Number(totals.sumOfSolutionOutOfWarranty).toLocaleString()} ءرء
              </span>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <strong>قطعه داخل گارانتی:</strong>{" "}
              <span style={{ color: "#10b981", fontWeight: "bold" }}>
                {Number(totals.sumOfPartIncludeWarranty).toLocaleString()} ءرء
              </span>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <strong>قطعه خارج از گارانتی:</strong>{" "}
              <span style={{ color: "#f97316", fontWeight: "bold" }}>
                {Number(totals.sumOfPartOutOfWarranty).toLocaleString()} ءرء
              </span>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <strong>حداقل پرداخت مشتری:</strong>{" "}
              {Number(
                totals.atLeastPayFromCustomerForOutOfWarranty
              ).toLocaleString()}{" "}
              ءرء
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <strong>پرداخت نقدی گرفته‌شده:</strong>{" "}
              {Number(totals.givenCashPayment).toLocaleString()} ءرء
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <strong>پرداخت اضافه VIP:</strong>{" "}
              {Number(
                totals.extraCashPaymentForUnavailableVip
              ).toLocaleString()}{" "}
              ءرء
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <strong>پرداخت نماینده به شرکت:</strong>{" "}
              {Number(totals.organizationToCompany).toLocaleString()} ءرء
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <strong>پرداخت شرکت به نماینده:</strong>{" "}
              {Number(totals.companyToOrganization).toLocaleString()} ءرء
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <strong>مجموع پرداخت نماینده به شرکت:</strong>{" "}
              {Number(totals.sumOfOrganizationToCompany).toLocaleString()} ءرء
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <strong>مجموع پرداخت شرکت به نماینده:</strong>{" "}
              {Number(totals.sumOfCompanyToOrganization).toLocaleString()} ءرء
            </Grid>
          </Grid>
        </Paper>
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
