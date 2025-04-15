import React, { useEffect, useMemo, useRef, useState } from "react";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const LightDataGridClient = ({
  url,
  columns,
  triggered,
  detailPanel,
  session,
}) => {
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [expandedRows, setExpandedRows] = useState({});
  const searchTimeoutRef = useRef(null);

  //table state
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const addressInitialized = useRef(false);

  const totalPages = Math.ceil(rowCount / pagination.pageSize);

  const fetchData = async () => {
    if (!data?.length) {
      setIsLoading(true);
    } else {
      setIsRefetching(true);
    }

    const urls = new URL(`${url}`, process.env.NEXT_PUBLIC_BASE_URL);
    urls.searchParams.set(
      "offset",
      `${pagination.pageIndex * pagination.pageSize}`
    );
    urls.searchParams.set("limit", `${pagination.pageSize}`);
    urls.searchParams.set("filters", JSON.stringify(columnFilters ?? []));
    urls.searchParams.set("search", searchValue || "");
    urls.searchParams.set("sorting", JSON.stringify(sorting ?? []));

    try {
      const response = await fetch(urls.href, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
      });
      const json = await response.json();
      setData(json.result);
      setRowCount(json.total);
    } catch (error) {
      setIsError(true);
      console.error(error);
      return;
    }
    setIsError(false);
    setIsLoading(false);
    setIsRefetching(false);
  };

  const debouncedSearchValue = useDebounce(searchValue, 500);

  useEffect(() => {
    if (!addressInitialized.current && session) {
      fetchData();
      addressInitialized.current = true;
    } else {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    columnFilters,
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
    triggered,
    debouncedSearchValue, // ✅ use this instead
  ]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout with debounce (500ms)
    searchTimeoutRef.current = setTimeout(() => {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, 2000);
  };

  const toggleRowExpand = (rowId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  const goToPage = (pageIndex) => {
    setPagination((prev) => ({ ...prev, pageIndex }));
  };

  const handlePrevious = () => {
    if (pagination.pageIndex > 0) {
      setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex - 1 }));
    }
  };

  const handleNext = () => {
    if (pagination.pageIndex < totalPages - 1) {
      setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }));
    }
  };

  // Generate skeleton rows for loading state
  const skeletonRows = Array(pagination.pageSize)
    .fill(0)
    .map((_, index) => (
      <div
        key={`skeleton-${index}`}
        className="grid gap-4 py-3 px-6 border-b border-gray-200"
        style={{
          gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
        }}
      >
        {columns.map((col, colIndex) => (
          <div
            key={`skeleton-col-${colIndex}`}
            className="h-4 bg-gray-200 rounded animate-pulse"
          ></div>
        ))}
      </div>
    ));

  // Calculate min height to maintain consistent height
  const minHeight = 400; // You can adjust this value as needed
  const emptyStateHeight = minHeight - 150; // Adjust for header/search/pagination height

  return (
    <div
      className="bg-white rounded-lg shadow overflow-hidden flex flex-col"
      style={{ minHeight: `${minHeight}px` }}
    >
      {/* Search Input */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="جستجو..."
            value={searchValue}
            onChange={handleSearch}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {isError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p>خطا در بارگزاری اطلاعات</p>
        </div>
      )}

      {/* Header */}
      <div
        className="grid gap-4 py-3 px-6 bg-gray-50 border-b border-gray-200"
        style={{
          gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
        }}
      >
        {columns.map((column) => (
          <div
            key={column.accessorKey}
            className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {column.header}
          </div>
        ))}
      </div>

      {/* Data Rows */}
      <div className="flex-1">
        {isLoading || isRefetching ? (
          skeletonRows
        ) : data.length > 0 ? (
          data.map((row) => (
            <React.Fragment key={row.id}>
              <div
                className="flex gap-4 py-4 items-center px-6 border-b justify-between border-gray-200 hover:bg-gray-50"
                style={{
                  gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
                }}
              >
                {columns.map((column) => (
                  <div
                    key={`${row.id}-${column.accessorKey}`}
                    className="whitespace-nowrap overflow-hidden text-ellipsis"
                  >
                    {column.Cell
                      ? column.Cell({ row })
                      : row[column.accessorKey]}
                  </div>
                ))}
              </div>
              {detailPanel && expandedRows[row.id] && (
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  {detailPanel({ row })}
                </div>
              )}
            </React.Fragment>
          ))
        ) : (
          <div
            className="flex items-center justify-center text-gray-500"
            style={{ height: `${emptyStateHeight}px` }}
          >
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium">داده ای یافت نشد</h3>
              <p className="mt-1 text-sm">هیچ رکوردی برای نمایش وجود ندارد</p>
            </div>
          </div>
        )}
      </div>

      {/* Pagination - Only show if we have data */}
      {rowCount > 0 && (
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={handlePrevious}
              disabled={pagination.pageIndex === 0}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                pagination.pageIndex === 0
                  ? "bg-gray-100 text-gray-400"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              قبلی
            </button>
            <button
              onClick={handleNext}
              disabled={pagination.pageIndex >= totalPages - 1}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                pagination.pageIndex >= totalPages - 1
                  ? "bg-gray-100 text-gray-400"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              بعدی
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                نمایش{" "}
                <span className="font-medium">
                  {pagination.pageIndex * pagination.pageSize + 1}
                </span>{" "}
                تا{" "}
                <span className="font-medium">
                  {Math.min(
                    (pagination.pageIndex + 1) * pagination.pageSize,
                    rowCount
                  )}
                </span>{" "}
                از <span className="font-medium">{rowCount}</span> نتایج
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={handlePrevious}
                  disabled={pagination.pageIndex === 0}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    pagination.pageIndex === 0
                      ? "text-gray-300"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">قبلی</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {Array.from({ length: Math.min(5, totalPages) }).map(
                  (_, index) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = index;
                    } else if (pagination.pageIndex <= 2) {
                      pageNum = index;
                    } else if (pagination.pageIndex >= totalPages - 3) {
                      pageNum = totalPages - 5 + index;
                    } else {
                      pageNum = pagination.pageIndex - 2 + index;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          pagination.pageIndex === pageNum
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  }
                )}

                <button
                  onClick={handleNext}
                  disabled={pagination.pageIndex >= totalPages - 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    pagination.pageIndex >= totalPages - 1
                      ? "text-gray-300"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">بعدی</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const customComparator = (prevProps, nextProps) => {
  return nextProps.triggered === prevProps.triggered;
};

export default React.memo(LightDataGridClient, customComparator);
