import { useState } from "react";
import { User } from "lucide-react";

import DriverTable from "./components/DriverTable";
import { useGetDriversQuery } from "./DriverApiSlice";
import type { FilterOption } from "../../types/CommonTypes";
import PageHeader from "../../components/common/PageHeader";
import Filters from "../../components/common/Filters";
import type { SerializedError } from "../../types/auth";
import TablePagination from "../../components/common/TablePagination";

export default function DriversPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [filterParams, setFilterParams] = useState({ column: "", value: "" });

  const {
    data: pagedResult,
    isLoading,
    isSuccess,
    isError,
    error,
    isFetching,
  } = useGetDriversQuery({
    pageNumber: page,
    pageSize: pageSize,
    filterColumn: filterParams.column,
    filterValue: filterParams.value,
  });

  const drivers = pagedResult?.data || [];

  const breadcrumbPaths = [{ label: "Drivers" }];

  const handleSearch = (column: string, value: string) => {
    setFilterParams({ column, value });
    setPage(1);
  };

  const filterOptions: FilterOption[] = [
    { label: "Driver ID", value: "driverid", type: "text" },
    { label: "Person ID", value: "personid", type: "text" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <PageHeader title="Drivers Management" breadcrumbs={breadcrumbPaths} />

      <section className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
        <Filters filterOptions={filterOptions} onSearch={handleSearch} />
      </section>

      <main className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="min-h-100 flex flex-col">
          {isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500 font-medium font-arabic">
                Loading Drivers Records...
              </p>
            </div>
          )}

          {isError && (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center px-4">
              <div className="text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-full mb-4">
                <User className="w-8 h-8" />
              </div>
              <h3 className="text-gray-900 dark:text-white font-bold">
                {(error as SerializedError)?.data?.title || "Connection Error"}
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                {(error as SerializedError)?.data?.detail ||
                  "Unable to fetch drivers from server."}
              </p>
            </div>
          )}

          {isSuccess && (
            <div
              className={`${isFetching ? "opacity-50 pointer-events-none" : ""} transition-opacity duration-200`}
            >
              <DriverTable drivers={drivers} />

              {drivers.length === 0 && !isFetching && (
                <div className="py-20 text-center text-gray-500 flex flex-col items-center gap-2">
                  <User className="w-12 h-12 text-gray-200" />
                  <p>No drivers found matching your search.</p>
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
