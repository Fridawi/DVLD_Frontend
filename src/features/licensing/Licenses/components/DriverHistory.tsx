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
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
            <div className="flex items-center gap-2">
              <History className="text-blue-600 size-5" />
              <h2 className="text-lg font-bold dark:text-white">
                Driver Records
              </h2>
            </div>

            <TabList className="flex gap-4">
              <Tab
                className={({ selected }) => `
                  px-4 py-2 text-sm font-bold rounded-lg transition-all focus:outline-none
                  ${selected ? "bg-blue-600 text-white shadow-md" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"}
                `}
              >
                Local Licenses ({localLicenses.length})
              </Tab>
              <Tab
                className={({ selected }) => `
                  px-4 py-2 text-sm font-bold rounded-lg transition-all focus:outline-none
                  ${selected ? "bg-blue-600 text-white shadow-md" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"}
                `}
              >
                International Licenses ({intLicenses.length})
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
                ) : (
                  <LicensesTable
                    licenses={localLicenses.map((l) => ({
                      ...l,
                      paidFees: 0,
                    }))}
                  />
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
