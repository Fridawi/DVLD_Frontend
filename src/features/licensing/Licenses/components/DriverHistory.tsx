import { useParams } from "react-router-dom";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { History, Globe, Loader2 } from "lucide-react";

import LicensesTable from "./LicensesTable";
import DriverLicenseCard from "./DriverLicenseCard";
import {
  useGetLicenseByIdQuery,
  useGetLicensesByDriverIdQuery,
} from "../LicenseApiSlice";
import PageHeader from "../../../../components/common/PageHeader";
import { useGetInternationalLicensesByDriverIdQuery } from "../../International License/InternationalLicenseApiSlice";
import InternationalLicensesTable from "../../International License/components/InternationalLicensesTable";
import { useTitle } from "../../../../hooks/useTitle";

export default function DriverHistoryPage() {
  const { licenseID } = useParams<{ licenseID: string }>();

  const { data: license, isLoading: isLoadingLicense } = useGetLicenseByIdQuery(
    Number(licenseID),
  );

  const driverId = license?.driverID ?? 0;

  const { data: pagedResult, isLoading: isLoadingHistory } =
    useGetLicensesByDriverIdQuery(
      {
        driverId: driverId,
        pageNumber: 1,
        pageSize: 10,
      },
      { skip: !driverId },
    );

  const { data: intPagedResult, isLoading: isLoadingIntHistory } =
    useGetInternationalLicensesByDriverIdQuery(
      {
        driverId: driverId,
        pageNumber: 1,
        pageSize: 10,
      },
      { skip: !driverId },
    );

  useTitle(
    license
      ? `History: ${license.driverID} | DVLD`
      : "Loading Driver History...",
  );
  const localLicenses = pagedResult?.data || [];
  const intLicenses = intPagedResult?.data || [];

  if (isLoadingLicense) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-slate-500 font-bold">Loading Driver Info...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300">
      <PageHeader
        title="Driver History"
        breadcrumbs={[
          { label: "Drivers", path: "/drivers" },
          { label: "Driver History" },
        ]}
      />

      <DriverLicenseCard licenseId={Number(licenseID)} />

      <div className="animate-in fade-in slide-in-from-top-4 duration-500">
        <TabGroup>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <History className="text-blue-600 dark:text-blue-400 size-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Driver Records
              </h2>
            </div>

            <TabList className="flex bg-gray-100 dark:bg-gray-900/50 p-1 rounded-xl w-full sm:w-auto">
              <Tab
                className={({ selected }) => `
            flex items-center justify-center gap-2 px-6 py-2 text-sm font-bold rounded-lg transition-all focus:outline-none w-full sm:w-auto
            ${
              selected
                ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-black/5"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }
          `}
              >
                <History className="size-4" />
                Local({localLicenses.length})
              </Tab>
              <Tab
                className={({ selected }) => `
            flex items-center justify-center gap-2 px-6 py-2 text-sm font-bold rounded-lg transition-all focus:outline-none w-full sm:w-auto
            ${
              selected
                ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-black/5"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }
          `}
              >
                <Globe className="size-4" />
                International({intLicenses.length})
              </Tab>
            </TabList>
          </div>

          <TabPanels className="mt-4">
            <TabPanel className="focus:outline-none">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {isLoadingHistory ? (
                  <div className="p-10 text-center">
                    <Loader2 className="animate-spin mx-auto text-slate-400" />
                  </div>
                ) : localLicenses.length > 0 ? (
                  <LicensesTable
                    licenses={localLicenses.map((l) => ({
                      ...l,
                      paidFees: 0,
                    }))}
                  />
                ) : (
                  <div className="p-12 text-center border-dashed border-2 border-gray-100 dark:border-gray-700 m-4 rounded-xl">
                    <History className="size-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">
                      No local license records found for this driver.
                    </p>
                  </div>
                )}
              </div>
            </TabPanel>

            <TabPanel className="focus:outline-none">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {isLoadingIntHistory ? (
                  <div className="p-10 text-center">
                    <Loader2 className="animate-spin mx-auto text-slate-400" />
                  </div>
                ) : intLicenses.length > 0 ? (
                  <InternationalLicensesTable licenses={intLicenses} />
                ) : (
                  <div className="p-12 text-center border-dashed border-2 border-gray-100 dark:border-gray-700 m-4 rounded-xl">
                    <Globe className="size-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">
                      No international license records found for this driver.
                    </p>
                  </div>
                )}
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
}
