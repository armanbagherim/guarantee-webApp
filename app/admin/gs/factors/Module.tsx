"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAtom } from "jotai";
import LightDataGrid from "@/app/components/admin-components/LightDataGrid/LightDataGrid";
import { columns } from "./columns";
import { fetcher } from "@/app/components/admin-components/fetcher";
import toast from "@/app/components/toast";
import {
  Box,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Stack,
  Divider,
  InputAdornment,
  Badge,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import DateRangeIcon from "@mui/icons-material/DateRange";
import NumbersIcon from "@mui/icons-material/Numbers";
import CategoryIcon from "@mui/icons-material/Category";
import DatePickerPersian from "@/app/components/utils/DatePicker";

export default function EavTypesModule() {
  const [triggered, setTriggered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requestTypes, setRequestTypes] = useState([]);
  const [currentUrl, setCurrentUrl] = useState(
    "/v1/api/guarantee/cartable/factors"
  );
  const baseUrl = "/v1/api/guarantee/cartable/factors";

  const [filters, setFilters] = useState({
    greaterThan: "",
    lessThan: "",
    factorId: "",
    requestId: "",
    nationalCode: "",
    phoneNumber: "",
    firstname: "",
    lastname: "",
    serialNumber: "",
    requestTypeId: "",
  });

  useEffect(() => {
    const fetchRequestTypes = async () => {
      setLoading(true);
      try {
        const res = await fetcher({
          url: "/v1/api/guarantee/cartable/requestTypes",
          method: "GET",
        });
        if (res?.result) {
          setRequestTypes(res.result);
        }
      } catch (err) {
        toast.error(err?.message || "خطا در دریافت انواع درخواست");
      } finally {
        setLoading(false);
      }
    };
    fetchRequestTypes();
    setTriggered(true);
  }, []);

  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleGreaterThanChange = useCallback((isoDate) => {
    if (!isoDate) {
      setFilters((prev) => ({ ...prev, greaterThan: "" }));
      return;
    }
    const date = new Date(isoDate);
    date.setHours(0, 0, 0, 0);
    setFilters((prev) => ({ ...prev, greaterThan: date.toISOString() }));
  }, []);

  const handleLessThanChange = useCallback((isoDate) => {
    if (!isoDate) {
      setFilters((prev) => ({ ...prev, lessThan: "" }));
      return;
    }
    const date = new Date(isoDate);
    date.setHours(23, 59, 59, 999);
    setFilters((prev) => ({ ...prev, lessThan: date.toISOString() }));
  }, []);

  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && String(value).trim() !== "") {
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
  }, [buildQueryString]);

  const resetFilters = useCallback(() => {
    setFilters({
      greaterThan: "",
      lessThan: "",
      factorId: "",
      requestId: "",
      nationalCode: "",
      phoneNumber: "",
      firstname: "",
      lastname: "",
      serialNumber: "",
      requestTypeId: "",
    });
    setCurrentUrl(baseUrl);
    setTriggered((prev) => !prev);
    toast.info("فیلترها بازنشانی شد");
  }, []);

  const getActiveFiltersCount = useCallback(() => {
    return Object.values(filters).filter(
      (value) => value && String(value).trim() !== ""
    ).length;
  }, [filters]);

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        {activeFiltersCount > 0 && (
          <Chip
            label={`${activeFiltersCount} فیلتر فعال`}
            color="primary"
            size="small"
            sx={{ fontWeight: "bold" }}
          />
        )}
      </Box>

      {/* Filters Section */}
      <Card
        sx={{
          mb: 4,
          boxShadow: 3,
          borderRadius: 3,
          overflow: "hidden",
          transition: "all 0.3s ease",
        }}
      >
        <Accordion
          defaultExpanded
          sx={{
            boxShadow: "none",
            "&:before": {
              display: "none",
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              bgcolor: "primary.main",
              color: "white",
              "& .MuiAccordionSummary-content": {
                margin: "12px 0",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Badge badgeContent={activeFiltersCount} color="error">
                <SearchIcon />
              </Badge>
              <span>جستجو و فیلتر کردن</span>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 2 }}>
            <Grid container>
              {/* Date Filters */}
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <DatePickerPersian
                      openPast={true}
                      label="از تاریخ"
                      date={filters.greaterThan}
                      onChange={handleGreaterThanChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <DatePickerPersian
                      openPast={true}
                      label="تا تاریخ"
                      date={filters.lessThan}
                      onChange={handleLessThanChange}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Divider sx={{ width: "100%", my: 2 }} />

              {/* ID Filters */}
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      fullWidth
                      label="شناسه عامل"
                      name="factorId"
                      value={filters.factorId}
                      onChange={handleFilterChange}
                      variant="outlined"
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
                      label="شناسه درخواست"
                      name="requestId"
                      value={filters.requestId}
                      onChange={handleFilterChange}
                      variant="outlined"
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
                      label="شماره سریال"
                      name="serialNumber"
                      value={filters.serialNumber}
                      onChange={handleFilterChange}
                      variant="outlined"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FingerprintIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Divider sx={{ width: "100%", my: 2 }} />

              {/* Personal Info Filters */}
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      fullWidth
                      label="کد ملی"
                      name="nationalCode"
                      value={filters.nationalCode}
                      onChange={handleFilterChange}
                      variant="outlined"
                      size="small"
                      inputProps={{ maxLength: 10 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FingerprintIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      fullWidth
                      label="شماره تلفن"
                      name="phoneNumber"
                      value={filters.phoneNumber}
                      onChange={handleFilterChange}
                      variant="outlined"
                      size="small"
                      inputProps={{ maxLength: 11 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      fullWidth
                      label="نام"
                      name="firstname"
                      value={filters.firstname}
                      onChange={handleFilterChange}
                      variant="outlined"
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
                    <TextField
                      fullWidth
                      label="نام خانوادگی"
                      name="lastname"
                      value={filters.lastname}
                      onChange={handleFilterChange}
                      variant="outlined"
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
                </Grid>
              </Grid>

              <Divider sx={{ width: "100%", my: 2 }} />

              {/* Request Type Filter */}
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth variant="outlined" size="small">
                      <InputLabel>نوع درخواست</InputLabel>
                      <Select
                        name="requestTypeId"
                        value={filters.requestTypeId}
                        onChange={handleFilterChange}
                        label="نوع درخواست"
                        disabled={loading}
                        startAdornment={
                          <InputAdornment position="start">
                            <CategoryIcon fontSize="small" />
                          </InputAdornment>
                        }
                      >
                        <MenuItem value="">
                          <em>همه</em>
                        </MenuItem>
                        {requestTypes.map((type: any) => (
                          <MenuItem key={type.id} value={type.id}>
                            {type.title}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Stack
              direction="row"
              spacing={2}
              sx={{ mt: 3, justifyContent: "flex-end" }}
            >
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={resetFilters}
                disabled={activeFiltersCount === 0}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  px: 3,
                  fontWeight: "bold",
                }}
              >
                پاک کردن فیلترها
              </Button>
              <Button
                variant="contained"
                startIcon={<FilterListIcon />}
                onClick={applyFilters}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  px: 3,
                  fontWeight: "bold",
                  background:
                    "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                  boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #1976D2 30%, #00ACC1 90%)",
                  },
                }}
              >
                اعمال فیلترها
              </Button>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Card>

      {/* Data Grid */}
      <LightDataGrid
        triggered={triggered}
        url={currentUrl}
        columns={columns()}
      />
    </Box>
  );
}
