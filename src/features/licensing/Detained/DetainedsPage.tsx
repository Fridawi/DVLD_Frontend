import { useState } from "react";
import { ShieldAlert } from "lucide-react";

import DetainedsTable from "./components/DetainedsTable";
import { useGetAllDetainedLicensesQuery } from "./DetainedApiSlice";
import type { FilterOption } from "../../../types/CommonTypes";
import PageHeader from "../../../components/common/PageHeader";
import Filters from "../../../components/common/Filters";
import type { SerializedError } from "../../../types/auth";
import TablePagination from "../../../components/common/TablePagination";
import { useTitle } from "../../../hooks/useTitle";

export default function DetainedsPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [filterParams, setFilterParams] = useState({ column: "", value: "" });
  useTitle("Manage Detained Licenses");

  const {
    data: pagedResult,
    isLoading,
    isSuccess,
    isError,
    error,
    isFetching,
  } = useGetAllDetainedLicensesQuery({
    pageNumber: page,
    pageSize: pageSize,
    filterColumn: filterParams.column,
    filterValue: filterParams.value,
  });

  const detainedLicenses = pagedResult?.data || [];

  const breadcrumbPaths = [
    { label: "Licenses", path: "/licenses/manage" },
    { label: "Detained Licenses" },
  ];

  const handleSearch = (column: string, value: string) => {
    setFilterParams({ column, value });
    setPage(1);
  };

  const filterOptions: FilterOption[] = [
    { label: "Detain ID", value: "detainid", type: "text" },
    { label: "License ID", value: "licenseid", type: "text" },
    { label: "National No", value: "nationalno", type: "text" },
    { label: "Full Name", value: "fullname", type: "text" },
    {
      label: "Status",
      value: "isreleased",
      type: "select",
      options: [
        { label: "Released", value: "true" },
        { label: "Detained", value: "false" },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <PageHeader
        title="Manage Detained Licenses"
        breadcrumbs={breadcrumbPaths}
      />

      <section className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
        <Filters filterOptions={filterOptions} onSearch={handleSearch} />
      </section>

      <main className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="min-h-100 flex flex-col">
          {isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500 font-medium">
                Loading Detained Records...
              </p>
            </div>
          )}

          {isError && (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center px-4">
              <div className="text-rose-500 bg-rose-50 dark:bg-rose-900/20 p-4 rounded-full mb-4">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h3 className="text-gray-900 dark:text-white font-bold">
                {(error as SerializedError)?.data?.title || "Connection Error"}
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                {(error as SerializedError)?.data?.detail ||
                  "Unable to fetch detained licenses from server."}
              </p>
            </div>
          )}

          {isSuccess && (
            <div
              className={`${isFetching ? "opacity-50 pointer-events-none" : ""} transition-opacity duration-200`}
            >
              <DetainedsTable detainedLicenses={detainedLicenses} />

              {detainedLicenses.length === 0 && !isFetching && (
                <div className="py-20 text-center text-gray-500 flex flex-col items-center gap-2">
                  <ShieldAlert className="w-12 h-12 text-gray-200" />
                  <p>No detained licenses found matching your search.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {isSuccess && pagedResult && pagedResult.totalCount > 0 && (
        <TablePagination
          page={page}
          pageSize={pageSize}
          totalCount={pagedResult.totalCount}
          totalPages={Math.ceil(pagedResult.totalCount / pageSize)}
          hasNext={page < Math.ceil(pagedResult.totalCount / pageSize)}
          hasPrevious={page > 1}
          onPageChange={(newPage) => setPage(newPage)}
          isFetching={isFetching}
        />
      )}
    </div>
  );
}
