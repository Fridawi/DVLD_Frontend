import { useState } from "react";
import { useGetApplicationTypesQuery } from "./applicationTypesApiSlice";
import PageHeader from "../../../components/common/PageHeader";
import Filters from "../../../components/common/Filters";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import TablePagination from "../../../components/common/TablePagination";
import type { SerializedError } from "../../../types/auth";
import ApplicationTypesTable from "./components/ApplicationTypesTable";
import { useAppSelector } from "../../../hooks/hooks";
import type { FilterOption } from "../../../types/CommonTypes";
import { useTitle } from "../../../hooks/useTitle";

export default function ApplicationTypePage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [filterParams, setFilterParams] = useState({ column: "", value: "" });
  const { user } = useAppSelector((state) => state.auth);
  useTitle("Application Types");

  const {
    data: pagedResult,
    isLoading,
    isSuccess,
    isError,
    error,
    isFetching,
  } = useGetApplicationTypesQuery({
    pageNumber: page,
    pageSize: pageSize,
    filterColumn: filterParams.column,
    filterValue: filterParams.value,
  });

  const applicationTypes = pagedResult?.data || [];
  const breadcrumbPaths = [{ label: "Application Types" }];
  const handleSearch = (column: string, value: string) => {
    setFilterParams({ column, value });
    setPage(1);
  };

  const filterOptions: FilterOption[] = [
    { label: "Application Type ID", value: "applicationtypeid", type: "text" },
    { label: "Title", value: "title", type: "text" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Application Types Management"
        breadcrumbs={breadcrumbPaths}
      />
      <section className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
        <Filters filterOptions={filterOptions} onSearch={handleSearch} />

        {user?.role === "Admin" && (
          <Link
            to="add"
            className="w-full md:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Application Type</span>
          </Link>
        )}
      </section>

      <main className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="min-h-100 flex flex-col">
          {isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500 font-medium">
                Loading application types...
              </p>
            </div>
          )}

          {isError && (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center px-4">
              <div className="text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-full mb-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-gray-900 dark:text-white font-bold">
                {(error as SerializedError)?.data?.title || "Connection Error"}
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                {(error as SerializedError)?.data?.detail ||
                  "Unable to fetch data from server."}
              </p>
            </div>
          )}

          {isSuccess && (
            <div
              className={`${isFetching ? "opacity-50 pointer-events-none" : ""} transition-opacity duration-200`}
            >
              <ApplicationTypesTable applicationTypes={applicationTypes} />
              {applicationTypes.length === 0 && !isFetching && (
                <div className="py-20 text-center text-gray-500">
                  No application types found matching your search.
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {isSuccess && pagedResult && (
        <TablePagination
          page={page}
          pageSize={pageSize}
          totalCount={pagedResult.totalCount}
          totalPages={pagedResult.totalPages}
          hasNext={pagedResult.hasNext}
          hasPrevious={pagedResult.hasPrevious}
          onPageChange={(newPage) => setPage(newPage)}
          isFetching={isFetching}
        />
      )}
    </div>
  );
}
