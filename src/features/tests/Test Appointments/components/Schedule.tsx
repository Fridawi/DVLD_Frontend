import { useParams, useNavigate } from "react-router-dom";
import { Plus, Calendar, Info, ShieldCheck } from "lucide-react";
import { useGetLocalDrivingLicenseApplicationByIdQuery } from "../../../applications/localApp/LocalAppApiSlice";
import { useGetTestTypeByIdQuery } from "../../test Types/TestTypesApiSlice";
import {
  useGetAppointmentsByLocalAppAndTestTypeQuery,
  useHasActiveAppointmentQuery,
} from "../TestAppointmentApiSlice";
import PageHeader from "../../../../components/common/PageHeader";
import LocalAppCard from "../../../applications/localApp/components/LocalAppCard";
import ApplicationCard from "../../../applications/components/ApplicationDetails";
import TestAppointmentsTable from "./TestAppointmentsTable";
import { toast } from "sonner";
import { useTitle } from "../../../../hooks/useTitle";

export default function LocalAppTestAppointmentsPage() {
  const { localAppID, testTypeID } = useParams();
  const navigate = useNavigate();

  const { data: localApp, isLoading: isLoadingApp } =
    useGetLocalDrivingLicenseApplicationByIdQuery(Number(localAppID));
  const { data: testType } = useGetTestTypeByIdQuery(Number(testTypeID));

  const { data: pagedResult, isLoading: isLoadingAppointments } =
    useGetAppointmentsByLocalAppAndTestTypeQuery({
      localAppID: Number(localAppID),
      testTypeID: Number(testTypeID),
    });

  const { data: hasActive, isLoading: isLoadingActiveCheck } =
    useHasActiveAppointmentQuery({
      localAppID: Number(localAppID),
      testTypeID: Number(testTypeID),
    });

  const appointments = pagedResult?.data || [];

  useTitle(testType ? `${testType.title} Appointments` : "Test Appointments");

  const handleAddNewAppointment = () => {
    if (hasActive) {
      toast("Active appointment already exists.", {
        icon: "⏳",
      });
      return;
    }

    if (localApp && localApp.passedTestCount >= Number(testTypeID)) {
      toast("Test already passed.", {
        icon: "✅",
      });
      return;
    }

    navigate(`/tests/appointments/scheduleTest/${localAppID}/${testTypeID}`);
  };

  if (isLoadingApp || isLoadingAppointments || isLoadingActiveCheck) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 p-4 lg:p-8 bg-gray-50/30 dark:bg-transparent min-h-screen">
      <PageHeader
        title={`${testType?.title || "Test"} Appointments`}
        breadcrumbs={[
          { label: "Local Applications", path: "/applications/local" },
          { label: "Appointments History" },
        ]}
      />

      <div className="flex flex-col gap-6 w-full">
        <div className="w-full">
          <LocalAppCard app={localApp!} />
        </div>
        <div className="w-full">
          <ApplicationCard applicationId={localApp!.applicationID} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden w-full">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="hidden xs:inline">Test</span> Appointments
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 hidden sm:block">
              Manage scheduling records for this test.
            </p>
          </div>

          <button
            onClick={handleAddNewAppointment}
            title="Add New Appointment"
            className="flex items-center justify-center gap-1.5 px-3 py-2 sm:px-5 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md active:scale-95 text-sm shrink-0"
          >
            <Plus className="w-4 h-4 shrink-0" />

            <span className="inline-block">
              Add
              <span className="hidden sm:inline-block ml-1">Appointment</span>
            </span>
          </button>
        </div>

        <div className="p-2 sm:p-4">
          {appointments.length > 0 ? (
            <div className="overflow-x-auto">
              <TestAppointmentsTable appointments={appointments} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <div className="p-4 rounded-full bg-gray-50 dark:bg-gray-900/50 mb-3">
                <Info size={40} className="opacity-20" />
              </div>
              <p className="text-lg font-medium text-gray-500">
                No appointments found.
              </p>
              <p className="text-xs mt-1 text-gray-400 text-center px-4">
                Click the button above to schedule the first one.
              </p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-700 flex justify-end">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Total:
            <span className="text-blue-600 dark:text-blue-400 text-sm">
              {appointments.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
