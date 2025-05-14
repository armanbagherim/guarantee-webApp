import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { MRT_Localization_FA } from "material-react-table/locales/fa";
import { useSession } from "next-auth/react";

const LightDataGrid = ({ url, columns, triggered, detailPanel }) => {
  const { data: session } = useSession();

  // State variables
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  // Table state
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const initialized = useRef(false);
  const isFetching = useRef(false); // Prevent concurrent fetches

  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();

    // Pagination
    params.set("offset", `${pagination.pageIndex * pagination.pageSize}`);
    params.set("limit", pagination.pageSize);

    // Sorting
    if (sorting.length > 0) {
      const { id, desc } = sorting[0];
      params.set("sortBy", id);
      params.set("sortOrder", desc ? "desc" : "asc");
    }

    // Global search
    if (globalFilter) {
      params.set("search", globalFilter);
    }

    // Column filters
    columnFilters.forEach((filter) => {
      if (filter.value) {
        params.set(filter.id, filter.value);
      }
    });

    return params.toString();
  }, [columnFilters, globalFilter, pagination, sorting]);

  const fetchData = useCallback(async () => {
    if (isFetching.current || !session?.token) return; // Skip if already fetching or no token
    isFetching.current = true;

    if (!initialized.current) {
      setIsLoading(true);
      initialized.current = true;
    } else {
      setIsRefetching(true);
    }

    try {
      const queryParams = buildQueryParams();
      let apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${url}`;
      const urlHasQuery = url.includes("?");
      const existingParams = urlHasQuery ? url.split("?")[1] : "";

      if (queryParams) {
        apiUrl += urlHasQuery
          ? existingParams
            ? `&${queryParams}`
            : queryParams
          : `?${queryParams}`;
      }

      const response = await fetch(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const json = await response.json();
      setData(json.data || json.result || []);
      setRowCount(json.total || json.rowCount || 0);
    } catch (error) {
      setIsError(true);
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
      isFetching.current = false;
    }
  }, [session?.token, url, buildQueryParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData, triggered]);

  const table = useMaterialReactTable({
    columns,
    data,
    getRowId: (row) => row.id,
    initialState: {
      density: "compact",
      columnPinning: { right: ["Actions"] },
    },
    columnFilterDisplayMode: "popover",
    enableSorting: false,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    },
    renderDetailPanel: detailPanel,
    localization: MRT_Localization_FA,
    muiTableProps: {
      sx: {
        borderCollapse: "collapse",
      },
    },
    muiTableBodyProps: {
      sx: {
        "& tr:nth-of-type(odd) > td": {
          backgroundColor: "#ffffff",
        },
      },
    },
  });

  return <MaterialReactTable table={table} />;
};

export default React.memo(LightDataGrid, (prevProps, nextProps) => {
  return nextProps.triggered === prevProps.triggered;
});