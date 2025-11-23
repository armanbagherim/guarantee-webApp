"use client";

import React, { useEffect, useState } from "react";
import { pageTitle } from "../../layout";
import { useAtom } from "jotai";
import LightDataGrid from "@/app/components/admin-components/LightDataGrid/LightDataGrid";
import { columns } from "./columns";
import FormGen from "./FormsGen";
import HistoryData from "./historyData";
import DetailPanel from "./DetailPanel";
import {
  TextField,
  MenuItem,
  Button,
  Grid,
  Paper,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import Attachements from "./attachements";
import CurrentState from "./currentState";
import RequestItems from "./RequestItems";

export default function EavTypesModule({ session, searchParams }) {
  const [title, setTitle] = useAtom(pageTitle);
  const [triggered, setTriggered] = useState(false);
  const [filtersReady, setFiltersReady] = useState(false);
  const [activeRequestActionModal, setActiveRequestActionModal] = useState({
    currentOperation: null,
    isOpen: false,
  });
  const [historyOpen, setHistoryOpen] = useState({
    requestId: null,
    isOpen: false,
  });
  const [currentOpen, setCurrentOpen] = useState({
    requestId: null,
    isOpen: false,
  });
  const [requestOpen, setRequestOpen] = useState({
    requestId: null,
    isOpen: false,
    request: null
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
    serialNumber: "", // Added serialNumber to filters
  });
  const [requestTypes, setRequestTypes] = useState([]);

  useEffect(() => {
    setTitle({
      title: "پیگیری درخواست ها",
      buttonTitle: null,
      link: null,
    });

    // Initialize filters from searchParams
    const filterKeys = [
      "requestId",
      "nationalCode",
      "phoneNumber",
      "firstname",
      "lastname",
      "requestTypeId",
      "serialNumber", // Added serialNumber to filterKeys
    ];

    const initialFilters = {};
    let shouldTrigger = false;

    filterKeys.forEach((key) => {
      if (searchParams?.[key]) {
        initialFilters[key] = searchParams[key];
        shouldTrigger = true;
      }
    });

    if (shouldTrigger) {
      setFilters((prev) => ({
        ...prev,
        ...initialFilters,
      }));
      setTriggered((prev) => !prev);
    }

    setFiltersReady(true); // Mark filters initialized

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

  const applyFilters = () => {
    setTriggered(!triggered);
  };

  const resetFilters = () => {
    setFilters({
      requestId: "",
      nationalCode: "",
      phoneNumber: "",
      firstname: "",
      lastname: "",
      requestTypeId: "",
      serialNumber: "", // Reset serialNumber
    });
    setTriggered(!triggered);
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

  return (
    <div>
      <FormGen
        triggered={triggered}
        setTriggered={setTriggered}
        session={session}
        action={activeRequestActionModal}
        setAction={setActiveRequestActionModal}
      />

      <HistoryData historyOpen={historyOpen} setHistoryOpen={setHistoryOpen} />
      <CurrentState historyOpen={currentOpen} setHistoryOpen={setCurrentOpen} />
      <RequestItems historyOpen={requestOpen} setHistoryOpen={setRequestOpen} />, 
      <Attachements
        historyOpen={attachementsOpen}
        setHistoryOpen={setAttachementsOpen}
      />

      {/* Filter Section */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="شماره درخواست"
              name="requestId"
              value={filters.requestId}
              onChange={handleFilterChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="کد ملی"
              name="nationalCode"
              value={filters.nationalCode}
              onChange={handleFilterChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="شماره تلفن"
              name="phoneNumber"
              value={filters.phoneNumber}
              onChange={handleFilterChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="نام"
              name="firstname"
              value={filters.firstname}
              onChange={handleFilterChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="نام خانوادگی"
              name="lastname"
              value={filters.lastname}
              onChange={handleFilterChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              select
              fullWidth
              label="نوع درخواست"
              name="requestTypeId"
              value={filters.requestTypeId}
              onChange={handleFilterChange}
              size="small"
            >
              <MenuItem value="">
                <em>همه</em>
              </MenuItem>
              {requestTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.title}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="شماره کارت گارانتی"
              name="serialNumber"
              value={filters.serialNumber}
              onChange={handleFilterChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} container justifyContent="flex-end" spacing={2}>
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

      {/* Conditionally render only when filters are ready */}
      {filtersReady && (
        <LightDataGrid
          triggered={triggered}
          url={`/v1/api/guarantee/admin/trackingRequests?${buildQueryString()}`}
          columns={columns(
            triggered,
            setTriggered,
            setActiveRequestActionModal,
            historyOpen,
            setHistoryOpen,
            attachementsOpen,
            setAttachementsOpen,
            currentOpen,
            setCurrentOpen,
            requestOpen,
            setRequestOpen
          )}
          detailPanel={DetailPanel}
        />
      )}
    </div>
  );
}