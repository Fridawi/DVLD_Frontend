import { useState, useEffect, type JSX } from "react";
import { Search, Loader2, AlertCircle, IdCard } from "lucide-react";
import { toast } from "sonner";
import LicenseInfoCard from "./LicenseInfoCard";
import type { License } from "../../../../types/licenses";
import type { FilterOption } from "../../../../types/CommonTypes";
import Filters from "../../../../components/common/Filters";
import { useGetLicenseByIdQuery } from "../LicenseApiSlice";

interface LicenseSelectorCardProps {
  onLicenseSelected: (license: License | null) => void;
  initialLicenseId?: number | null;
}

export default function LicenseSelectorCard({
  onLicenseSelected,
  initialLicenseId = null,
}: LicenseSelectorCardProps): JSX.Element {
  const [searchId, setSearchId] = useState<number | null>(initialLicenseId);

  const {
    data: licenseData,
    isFetching,
    isError,
  } = useGetLicenseByIdQuery(searchId ?? 0, {
    skip: !searchId,
  });

  useEffect(() => {
    if (licenseData) {
      onLicenseSelected(licenseData);
    } else {
      onLicenseSelected(null);
    }
  }, [licenseData, onLicenseSelected]);

  const handleSearch = (column: string, value: string) => {
    if (column === "licenseid" && value) {
      const id = Number(value);
      if (!isNaN(id)) {
        setSearchId(id);
      } else {
        toast.error("Invalid License ID format");
      }
    } else if (!value) {
      setSearchId(null);
    }
  };

  const filterOptions: FilterOption[] = [
    { label: "License ID", value: "licenseid", type: "text" },
  ];

  return (
    <div className="w-full space-y-4">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-3 shrink-0">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Search className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">
                  Find License
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Search by ID to retrieve license details
                </p>
              </div>
            </div>

            <div className="w-full lg:max-w-2xl">
              <Filters filterOptions={filterOptions} onSearch={handleSearch} />
            </div>
          </div>
        </div>

        <div className="p-6">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-12 animate-pulse">
              <Loader2 className="size-10 animate-spin text-blue-600 mb-4" />
              <p className="text-sm font-medium text-gray-500">
                Retrieving license data...
              </p>
            </div>
          ) : isError ? (
            <div className="flex items-center p-4 text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-800/50 dark:border-red-800 rounded-lg animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="size-5 me-3 shrink-0" />
              <div className="text-sm font-medium">
                No license found with ID #{searchId}. Please verify the ID and
                try again.
              </div>
            </div>
          ) : licenseData ? (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <LicenseInfoCard license={licenseData} />
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-gray-100 dark:border-gray-700/50 rounded-2xl">
              <div className="bg-gray-50 dark:bg-gray-900/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <IdCard className="size-10 text-gray-300 dark:text-gray-600" />
              </div>
              <h4 className="text-gray-900 dark:text-white font-bold text-base">
                No License Selected
              </h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 max-w-xs mx-auto">
                Enter the License ID in the search field above to load the
                driver's information.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
