"use client";

import React, { useEffect, useState } from "react";
import { pageTitle } from "../../layout";
import { useAtom } from "jotai";
import LightDataGrid from "@/app/components/admin-components/LightDataGrid/LightDataGrid";
import { columns } from "./columns";
import HistoryData from "./historyData";
import DetailPanel from "./DetailPanel";
import {
  TextField,
  MenuItem,
  Grid,
  Paper,
  Box,
  Chip,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
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
  interface Filters {
    requestId: string;
    requestIds: string[];
    nationalCode: string;
    phoneNumber: string;
    firstname: string;
    lastname: string;
    requestTypeId: string;
    serialNumber: string;
    activityId: string;
  }

  const [filters, setFilters] = useState<Filters>({
    requestId: "",
    requestIds: [],
    nationalCode: "",
    phoneNumber: "",
    firstname: "",
    lastname: "",
    requestTypeId: "",
    serialNumber: "",
    activityId: "",
  });
  const [requestTypes, setRequestTypes] = useState([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [activitiesLoaded, setActivitiesLoaded] = useState(false);

  useEffect(() => {
    setTitle({
      title: "پیگیری درخواست ها",
      buttonTitle: null,
      link: null,
    });

    // Initialize filters from searchParams
    const initialFilters: Partial<Filters> = {};
    let shouldTrigger = false;

    // Handle requestIds from query params
    if (searchParams?.requestIds) {
      const ids = Array.isArray(searchParams.requestIds)
        ? searchParams.requestIds
        : searchParams.requestIds.split(',').map((id: string) => id.trim());

      initialFilters.requestIds = ids;
      shouldTrigger = true;
    }

    // Handle other filters
    const otherFilterKeys = [
      "requestId",
      "nationalCode",
      "phoneNumber",
      "firstname",
      "lastname",
      "requestTypeId",
      "serialNumber",
      "activityId",
    ];

    otherFilterKeys.forEach((key) => {
      if (searchParams?.[key]) {
        initialFilters[key as keyof Filters] = searchParams[key];
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

    const fetchActivities = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/guarantee/cartable/allActivities`,
          {
            headers: {
              Authorization: `Bearer ${session.token}`,
            },
          }
        );
        const data = await response.json();
        // Extract activities from result property
        const activitiesData = Array.isArray(data?.result) ? data.result : [];
        setActivities(activitiesData);
        setActivitiesLoaded(true);
      } catch (error) {
        console.error("Error fetching activities:", error);
        setActivities([]);
        setActivitiesLoaded(true);
      }
    };

    fetchActivities();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Special handling for requestId to support comma-separated values
    if (name === 'requestId') {
      // If input ends with comma or space, extract the IDs
      if (value.endsWith(',') || value.endsWith(' ')) {
        const newId = value.slice(0, -1).trim();
        if (newId) {
          setFilters(prev => ({
            ...prev,
            requestId: '',
            requestIds: [...(prev.requestIds || []), newId],
          }));
          return;
        }
      }

      // Regular update for requestId
      setFilters(prev => ({
        ...prev,
        [name]: value,
      }));
      return;
    }

    // Regular update for other fields
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to remove a request ID from the array
  const removeRequestId = (idToRemove: string) => {
    setFilters(prev => ({
      ...prev,
      requestIds: (prev.requestIds || []).filter(id => id !== idToRemove)
    }));
  };

  // Function to handle key down events (Enter key)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filters.requestId.trim()) {
      e.preventDefault();
      const newId = filters.requestId.trim();
      if (newId) {
        setFilters(prev => ({
          ...prev,
          requestId: '',
          requestIds: [...(prev.requestIds || []), newId],
        }));
      }
    }
  };

  const applyFilters = () => {
    setTriggered(!triggered);
  };

  const resetFilters = () => {
    setFilters({
      requestId: "",
      requestIds: [],
      nationalCode: "",
      phoneNumber: "",
      firstname: "",
      lastname: "",
      requestTypeId: "",
      serialNumber: "",
      activityId: "",
    });
    setTriggered(!triggered);
  };

  const buildQueryString = () => {
    const params = new URLSearchParams();

    // Handle requestIds array - append each ID separately
    if (filters.requestIds?.length > 0) {
      // Convert all request IDs to integers and filter out any invalid values
      const intRequestIds = filters.requestIds
        .map(id => {
          const num = parseInt(id, 10);
          return isNaN(num) ? null : num;
        })
        .filter((id): id is number => id !== null);

      // Append each requestId separately so they are separated by &
      intRequestIds.forEach(id => {
        params.append('requestIds', id.toString());
      });
    }

    // Handle other filters
    (Object.entries(filters) as [keyof Filters, string | string[]][])
      .filter(([key]) => key !== 'requestIds')
      .forEach(([key, value]) => {
        // Only include if it has a non-empty value
        if (value && value.toString().trim() !== '') {
          params.append(key, value.toString());
        }
      });

    return params.toString();
  };

  return (
    <div>


      <HistoryData historyOpen={historyOpen} setHistoryOpen={setHistoryOpen} />
      <CurrentState historyOpen={currentOpen} setHistoryOpen={setCurrentOpen} />
      <RequestItems historyOpen={requestOpen} setHistoryOpen={setRequestOpen} />,
      <Attachements
        historyOpen={attachementsOpen}
        setHistoryOpen={setAttachementsOpen}
      />

      {/* Filter Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        {/* Request IDs Section - Separate from main grid */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="شماره درخواست (جدا شده با کاما)"
            name="requestId"
            value={filters.requestId}
            onChange={handleFilterChange}
            onKeyDown={handleKeyDown}
            placeholder="شماره درخواست را وارد کنید و اینتر بزنید"
            size="small"
            sx={{
              '& .MuiInputBase-root': {
                height: 40,
              },
            }}
          />
          {filters.requestIds?.length > 0 && (
            <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {filters.requestIds.map((id, index) => (
                <Chip
                  key={index}
                  label={id}
                  size="small"
                  onDelete={() => removeRequestId(id)}
                  sx={{
                    height: 24,
                    fontSize: '0.75rem',
                    '& .MuiChip-deleteIcon': {
                      fontSize: '1rem',
                      margin: '0 2px 0 -4px',
                    },
                  }}
                />
              ))}
            </Box>
          )}
          <Box sx={{ mt: 1, fontSize: '0.75rem', color: 'text.secondary' }}>
            برای افزودن چندین شماره، اینتر بزنید
          </Box>
        </Box>

        {/* Main Filter Grid */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="کد ملی"
              name="nationalCode"
              value={filters.nationalCode}
              onChange={handleFilterChange}
              size="small"
              sx={{
                '& .MuiInputBase-root': {
                  height: 40,
                },
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
              size="small"
              sx={{
                '& .MuiInputBase-root': {
                  height: 40,
                },
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
              size="small"
              sx={{
                '& .MuiInputBase-root': {
                  height: 40,
                },
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
              size="small"
              sx={{
                '& .MuiInputBase-root': {
                  height: 40,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="نوع درخواست"
              name="requestTypeId"
              value={filters.requestTypeId}
              onChange={handleFilterChange}
              size="small"
              sx={{
                '& .MuiInputBase-root': {
                  height: 40,
                },
              }}
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
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="شماره کارت گارانتی"
              name="serialNumber"
              value={filters.serialNumber}
              onChange={handleFilterChange}
              size="small"
              sx={{
                '& .MuiInputBase-root': {
                  height: 40,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="نوع فعالیت"
              name="activityId"
              value={filters.activityId}
              onChange={handleFilterChange}
              size="small"
              sx={{
                '& .MuiInputBase-root': {
                  height: 40,
                },
              }}
            >
              <MenuItem value="">
                <em>همه</em>
              </MenuItem>
              {activitiesLoaded && activities?.map((activity) => (
                <MenuItem key={activity.id} value={activity.id}>
                  {activity.name}
                </MenuItem>
              ))}
            </TextField>
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
        </div>

        {/* Business Button */}

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